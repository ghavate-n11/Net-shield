package com.example.netshield;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
public class NetshieldBackendApplication {

	private static final Logger logger = LoggerFactory.getLogger(NetshieldBackendApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(NetshieldBackendApplication.class, args);
		logger.info("Netshield Backend Application started successfully.");
	}

}
