package com.example.netshield.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class LogData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String ipAddress;
    private String protocol;
    private String status;

    // No-arg constructor (JPA requires this)
    public LogData() {
    }

    // Parameterized constructor (optional)
    public LogData(String ipAddress, String protocol, String status) {
        this.ipAddress = ipAddress;
        this.protocol = protocol;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // toString() method for debugging/logging
    @Override
    public String toString() {
        return "LogData{" +
                "id=" + id +
                ", ipAddress='" + ipAddress + '\'' +
                ", protocol='" + protocol + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
