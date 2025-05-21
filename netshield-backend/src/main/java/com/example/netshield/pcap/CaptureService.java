package com.example.netshield.pcap;

import org.pcap4j.core.*;
import org.pcap4j.packet.Packet;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class CaptureService {

    /**
     * List all available network interfaces as a formatted String.
     * 
     * @return String listing all devices or error message if none found.
     */
    public String listAllDevices() {
        StringBuilder sb = new StringBuilder();
        try {
            List<PcapNetworkInterface> devices = Pcaps.findAllDevs();
            if (devices == null || devices.isEmpty()) {
                return "No devices found. Make sure Npcap or libpcap is installed.";
            }

            sb.append("Available Network Interfaces:\n");
            for (int i = 0; i < devices.size(); i++) {
                PcapNetworkInterface device = devices.get(i);
                sb.append(i).append(": ").append(device.getName());
                String desc = device.getDescription();
                if (desc != null) {
                    sb.append(" (").append(desc).append(")");
                }
                sb.append("\n");
            }
        } catch (PcapNativeException e) {
            return "Error finding devices: " + e.getMessage();
        }
        return sb.toString();
    }

    /**
     * Capture a specified number of packets on the selected network interface.
     * 
     * @param interfaceIndex index of the network interface to capture on.
     * @param packetCount    number of packets to capture.
     * @param timeoutMillis  timeout in milliseconds for capture.
     * @return List of packet summaries as Strings.
     */
    public List<String> startCapture(int interfaceIndex, int packetCount, int timeoutMillis) {
        List<String> capturedPackets = new CopyOnWriteArrayList<>();

        try {
            List<PcapNetworkInterface> devices = Pcaps.findAllDevs();
            if (devices == null || devices.isEmpty()) {
                capturedPackets.add("No devices found. Make sure Npcap or libpcap is installed.");
                return capturedPackets;
            }

            if (interfaceIndex < 0 || interfaceIndex >= devices.size()) {
                capturedPackets.add("Invalid interface index: " + interfaceIndex);
                return capturedPackets;
            }

            PcapNetworkInterface nif = devices.get(interfaceIndex);
            capturedPackets.add("Capturing on: " + nif.getName() +
                    (nif.getDescription() != null ? " - " + nif.getDescription() : ""));

            try (PcapHandle handle = nif.openLive(
                    65536,
                    PcapNetworkInterface.PromiscuousMode.PROMISCUOUS,
                    timeoutMillis)) {

                handle.loop(packetCount, (Packet packet) -> {
                    String packetSummary = packet.toString();
                    System.out.println("Packet captured: " + packetSummary);
                    capturedPackets.add(packetSummary);
                });

            }

        } catch (PcapNativeException | NotOpenException | InterruptedException e) {
            String errMsg = "Error during capture: " + e.getMessage();
            System.err.println(errMsg);
            e.printStackTrace();
            capturedPackets.add(errMsg);
        }

        return capturedPackets;
    }

    /**
     * Run an nmap scan on the specified target IP address or subnet.
     * 
     * @param target IP address or subnet to scan.
     * @return Output of nmap command or error message.
     */
    public String runNmapScan(String target) {
        StringBuilder output = new StringBuilder();
        try {
            ProcessBuilder pb = new ProcessBuilder("nmap", "-sS", "-Pn", target);
            pb.redirectErrorStream(true); // Merge error stream with output stream

            Process process = pb.start();

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                output.append("Nmap scan exited with code ").append(exitCode).append("\n");
            }

        } catch (Exception e) {
            return "Error running nmap: " + e.getMessage();
        }

        return output.toString();
    }
}
