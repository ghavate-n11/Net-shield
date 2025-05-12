package com.netshield.controller;

import com.netshield.entity.PacketLog;
import com.netshield.service.PacketLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "http://localhost:3000") // React frontend, change accordingly
public class PacketLogController {

    @Autowired
    private PacketLogService packetLogService;

    @GetMapping
    public List<PacketLog> getAllLogs() {
        return packetLogService.getAllLogs();
    }

    @PostMapping
    public PacketLog addLog(@RequestBody PacketLog log) {
        return packetLogService.addLog(log);
    }
}
