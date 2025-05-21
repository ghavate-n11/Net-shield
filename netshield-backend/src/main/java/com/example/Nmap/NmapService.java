package com.example.Nmap;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.regex.Pattern;

@Service
public class NmapService {

    // Simple regex to validate IP address or domain name (basic check)
    private static final Pattern TARGET_PATTERN = Pattern.compile("^[a-zA-Z0-9.-]+$");

    public String runNmapScan(String target) {
        StringBuilder output = new StringBuilder();

        // Validate target input to avoid command injection
        if (target == null || !TARGET_PATTERN.matcher(target).matches()) {
            return "Invalid target input.";
        }

        try {
            // Build process to run nmap with service/version detection
            ProcessBuilder pb = new ProcessBuilder("nmap", "-sV", target);
            pb.redirectErrorStream(true);

            Process process = pb.start();

            // Read output line by line
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                output.append("Nmap exited with error code: ").append(exitCode).append("\n");
            }

        } catch (Exception e) {
            e.printStackTrace();
            output.append("Error running nmap: ").append(e.getMessage()).append("\n");
        }

        return output.toString();
    }
}
