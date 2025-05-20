package com.example.Nmap;

import java.io.BufferedReader;
import java.io.InputStreamReader;

public class NmapService {

    public String runNmapScan(String target) {
        StringBuilder output = new StringBuilder();

        try {
            ProcessBuilder pb = new ProcessBuilder("nmap", "-sV", target);
            pb.redirectErrorStream(true);

            Process process = pb.start();

            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                output.append("Nmap exited with error code: ").append(exitCode);
            }

        } catch (Exception e) {
            e.printStackTrace();
            output.append("Error running nmap: ").append(e.getMessage());
        }

        return output.toString();
    }
}
