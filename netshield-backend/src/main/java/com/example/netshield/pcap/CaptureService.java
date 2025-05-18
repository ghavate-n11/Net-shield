package com.example.netshield.pcap;

import org.pcap4j.core.*;
import java.util.List;

public class CaptureService {

    public void startCapture() {
        try {
            // Get all network interfaces
            List<PcapNetworkInterface> devices = Pcaps.findAllDevs();
            if (devices == null || devices.isEmpty()) {
                System.out.println("No devices found. Make sure Npcap is installed.");
                return;
            }

            // Choose a network interface (e.g., Wi-Fi or Ethernet)
            PcapNetworkInterface nif = devices.get(0); // Change index based on the correct interface
            System.out.println("Capturing on: " + nif.getName() + " - " + nif.getDescription());

            // Open the network interface for packet capture (in promiscuous mode)
            PcapHandle handle = nif.openLive(
                65536,  // Snapshot length (maximum packet size)
                PcapNetworkInterface.PromiscuousMode.PROMISCUOUS, 
                10  // Timeout (10ms)
            );

            // Capture 10 packets and print their details
            handle.loop(10, (PacketListener)packet -> {
                System.out.println("Packet captured: " + packet);
            });

            // Close the capture handle
            handle.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
