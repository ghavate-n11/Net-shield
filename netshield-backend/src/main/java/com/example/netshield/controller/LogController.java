package com.example.netshield.controller;

import com.example.netshield.entity.LogData;
import com.example.netshield.repository.LogDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "http://localhost:5173")
public class LogController {

    @Autowired
    private LogDataRepository repo;

    @GetMapping
    public List<LogData> getLogs() {
        return repo.findAll();
    }

    @PostMapping
    public LogData saveLog(@RequestBody LogData data) {
        return repo.save(data);
    }

    @GetMapping("/scan")
    public List<LogData> runNmapAndSave(@RequestParam String ip) {
        List<LogData> savedLogs = new ArrayList<>();
        try {
            ProcessBuilder pb = new ProcessBuilder("nmap", "-sS", "-p", "1-1000", ip);
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            String currentIp = ip;
            while ((line = reader.readLine()) != null) {
                // Example parse: lines like "PORT STATE SERVICE"
                // or "22/tcp open ssh"
                if (line.matches("\\d+/tcp\\s+\\w+\\s+.*")) {
                    String[] parts = line.split("\\s+");
                    if (parts.length >= 3) {
                        String portProtocol = parts[0]; // e.g., "22/tcp"
                        String status = parts[1]; // e.g., "open"
                        String protocol = parts[2]; // e.g., "ssh"

                        LogData log = new LogData();
                        log.setIpAddress(currentIp);
                        log.setProtocol(protocol);
                        log.setStatus(status);
                        savedLogs.add(repo.save(log));
                    }
                }
            }

            process.waitFor();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return savedLogs;
    }
}
