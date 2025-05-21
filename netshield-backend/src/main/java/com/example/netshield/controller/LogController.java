package com.example.netshield.controller;

import com.example.netshield.entity.LogData;
import com.example.netshield.repository.LogDataRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "http://localhost:5173")
public class LogController {

    private static final Logger logger = LoggerFactory.getLogger(LogController.class);

    @Autowired
    private LogDataRepository repo;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Get all saved logs
    @GetMapping
    public ResponseEntity<List<LogData>> getLogs() {
        List<LogData> logs = repo.findAll();
        return ResponseEntity.ok(logs);
    }

    // Save a log entry manually
    @PostMapping
    public ResponseEntity<LogData> saveLog(@RequestBody LogData data) {
        LogData savedLog = repo.save(data);
        return new ResponseEntity<>(savedLog, HttpStatus.CREATED);
    }

    // Run nmap scan on given IP, parse output, save logs and send live updates
    @PostMapping("/scan")
    public ResponseEntity<?> runNmapAndSave(@RequestBody ScanRequest request) {
        String ip = request.getIp();

        // Basic validation of IP input (allow IPv4, IPv6, domain names, ranges)
        if (!StringUtils.hasText(ip) || !ip.matches("^[a-zA-Z0-9.:-]+$")) {
            return ResponseEntity.badRequest().body("Invalid IP address or target");
        }

        logger.info("Starting Nmap scan for IP: {}", ip);

        List<LogData> savedLogs = new ArrayList<>();

        try {
            ProcessBuilder pb = new ProcessBuilder("nmap", "-sS", "-p", "1-1000", ip);
            pb.redirectErrorStream(true);

            Process process = pb.start();

            // Wait max 60 seconds for process to finish
            boolean finished = process.waitFor(60, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                logger.warn("Nmap scan timed out for IP: {}", ip);
                return ResponseEntity.status(HttpStatus.REQUEST_TIMEOUT).body("Nmap scan timed out");
            }

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    if (line.matches("\\d+/(tcp|udp)\\s+\\w+\\s+.*")) {
                        String[] parts = line.trim().split("\\s+");
                        if (parts.length >= 3) {
                            String portProtocol = parts[0]; // e.g., "22/tcp"
                            String status = parts[1]; // e.g., "open"
                            String protocol = parts[2]; // e.g., "ssh"

                            int port = Integer.parseInt(portProtocol.split("/")[0]);

                            LogData log = new LogData();
                            log.setIpAddress(ip);
                            log.setPort(port);
                            log.setProtocol(protocol);
                            log.setStatus(status);

                            LogData saved = repo.save(log);
                            savedLogs.add(saved);

                            // 🔴 Send live WebSocket update
                            messagingTemplate.convertAndSend("/topic/scan", saved);
                        }
                    }
                }
            }

            logger.info("Nmap scan completed for IP: {}. {} logs saved.", ip, savedLogs.size());

        } catch (Exception e) {
            logger.error("Error during nmap scan for IP: {}", ip, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error during nmap scan: " + e.getMessage());
        }

        return ResponseEntity.ok(savedLogs);
    }

    // Helper class for request body of /scan endpoint
    public static class ScanRequest {
        private String ip;

        public String getIp() {
            return ip;
        }

        public void setIp(String ip) {
            this.ip = ip;
        }
    }
}
