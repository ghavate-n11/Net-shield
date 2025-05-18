package com.example.netshield.controller;



import com.example.netshield.entity.*;
import com.example.netshield.repository.LogDataRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend to access this
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
}
