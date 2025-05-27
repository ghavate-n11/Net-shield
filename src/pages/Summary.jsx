// src/components/PacketSummary.jsx
import React from 'react';
//import './PacketSummary.css'; // Create this CSS file

export default function Summary({ packets }) {
    const total = packets.length;

    // Calculate protocol distribution
    const protocolCount = packets.reduce((acc, pkt) => {
        const proto = pkt.protocol || 'UNKNOWN'; // Handle cases where protocol might be missing
        acc[proto] = (acc[proto] || 0) + 1;
        return acc;
    }, {});

    // Calculate average packet length
    const totalLength = packets.reduce((sum, pkt) => sum + (pkt.length || 0), 0);
    const averageLength = total > 0 ? (totalLength / total).toFixed(2) : 0;

    // Bandwidth estimation using timestamps for real-time capture
    let duration = 0;
    if (total > 1) {
        // Assuming packets are sorted by timestamp, or find min/max
        const firstPacketTime = packets[0].timestamp;
        const lastPacketTime = packets[total - 1].timestamp;
        duration = (lastPacketTime - firstPacketTime) / 1000; // Duration in seconds
    }

    const totalBytes = totalLength;

    // Throughput in Mbps (Megabits per second)
    // totalBytes * 8 converts bytes to bits
    // duration converts milliseconds (if timestamp is in ms) to seconds
    // 1024 * 1024 converts bits to Megabits
    const throughputMbps = duration > 0 ? ((totalBytes * 8) / (duration * 1000 * 1000)).toFixed(2) : 0;


    return (
        <div className="stats-panel packet-summary-panel">
            <h3>Packet Summary</h3>
            <div className="summary-grid">
                <div className="summary-item">
                    <h4>Total Packets</h4>
                    <p>{total}</p>
                </div>
                <div className="summary-item">
                    <h4>Total Bytes</h4>
                    <p>{totalBytes} Bytes</p>
                </div>
                <div className="summary-item">
                    <h4>Avg. Packet Length</h4>
                    <p>{averageLength} Bytes</p>
                </div>
                <div className="summary-item">
                    <h4>Est. Throughput</h4>
                    <p>{throughputMbps} Mbps</p>
                </div>
            </div>

            <h4>Protocol Distribution</h4>
            {total === 0 ? (
                <p className="no-data">No packets captured yet.</p>
            ) : (
                <ul className="protocol-list">
                    {Object.entries(protocolCount).sort((a, b) => b[1] - a[1]).map(([proto, count]) => (
                        <li key={proto}>
                            <strong>{proto}:</strong> {count} packets ({((count / total) * 100).toFixed(2)}%)
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}