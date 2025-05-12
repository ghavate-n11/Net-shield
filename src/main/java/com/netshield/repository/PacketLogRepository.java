package com.netshield.repository;

import com.netshield.entity.PacketLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PacketLogRepository extends JpaRepository<PacketLog, Long> {
    // You can define custom queries here if needed
}
