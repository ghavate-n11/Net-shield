package com.netshield.service;

import com.netshield.entity.PacketLog;
import com.netshield.repository.PacketLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PacketLogService {

    @Autowired
    private PacketLogRepository packetLogRepository;

    public List<PacketLog> getAllLogs() {
        return packetLogRepository.findAll();
    }

    public PacketLog addLog(PacketLog log) {
        return packetLogRepository.save(log);
    }
}
