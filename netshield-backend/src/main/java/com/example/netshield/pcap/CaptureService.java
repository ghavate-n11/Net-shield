package com.example.netshield.pcap;

import org.pcap4j.core.*;
import org.pcap4j.packet.Packet;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class CaptureService {

    // List all available network interfaces as a String (for easier REST
    // integration)
    public String listAllDevices() {
        StringBuilder sb = new StringBuilder();
        try {
            List<PcapNetworkInterface> devices = Pcaps.findAllDevs();
            if (devices == null || devices.isEmpty()) {
                return "No devices found. Make sure Npcap is installed.";
            }

            sb.append("Available Network Interfaces:\n");
            for (int i = 0; i < devices.size(); i++) {
                PcapNetworkInterface device = devices.get(i);
                sb.append(i).append(": ").append(device.getName())
                        .append(" (").append(device.getDescription()).append(")\n");
            }
        } catch (PcapNativeException e) {
            return "Error finding devices: " + e.getMessage();
        }
        return sb.toString();
    }

    // Capture packets on a network interface by index and return captured packet
    // summaries as a List<String>
    public List<String> startCapture(int interfaceIndex, int packetCount, int timeoutMillis) {
        List<String> capturedPackets = new CopyOnWriteArrayList<>();

        try {
            List<PcapNetworkInterface> devices = Pcaps.findAllDevs();
            if (devices == null || devices.isEmpty()) {
                capturedPackets.add("No devices found. Make sure Npcap is installed.");
                return capturedPackets;
            }

            if (interfaceIndex < 0 || interfaceIndex >= devices.size()) {
                capturedPackets.add("Invalid interface index.");
                return capturedPackets;
            }

            PcapNetworkInterface nif = devices.get(interfaceIndex);
            capturedPackets.add("Capturing on: " + nif.getName() + " - " + nif.getDescription());

            try (PcapHandle handle = nif.openLive(
                    65536,
                    PcapNetworkInterface.PromiscuousMode.PROMISCUOUS,
                    timeoutMillis)) {

                // Loop to capture 'packetCount' packets
                handle.loop(packetCount, (Packet packet) -> {
                    String packetSummary = packet.toString();
                    System.out.println("Packet captured: " + packetSummary);
                    capturedPackets.add(packetSummary);
                });

            }

        } catch (PcapNativeException | NotOpenException | InterruptedException e) {
            capturedPackets.add("Error during capture: " + e.getMessage());
            e.printStackTrace();
        }

        return capturedPackets;
    }

    // Run an nmap scan on the target (IP address or subnet) and return the output
    // as a String
    public String runNmapScan(String target) {
        StringBuilder output = new StringBuilder();
        try {
            ProcessBuilder pb = new ProcessBuilder("nmap", "-sS", "-Pn", target);

            Process process = pb.start();

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                output.append("Nmap scan exited with code ").append(exitCode);
            }

        } catch (Exception e) {
            return "Error running nmap: " + e.getMessage();
        }

        return output.toString();
    }
}
