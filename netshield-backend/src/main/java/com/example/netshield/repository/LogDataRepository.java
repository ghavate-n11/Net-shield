package com.example.netshield.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.example.netshield.entity.LogData;

public interface LogDataRepository extends JpaRepository<LogData, Long> {
}
