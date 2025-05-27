// src/components/ProtocolHierarchy.jsx
import React from 'react';
//import './ProtocolHierarchy.css'; // Create this CSS file

export default function ProtocolHierarchy({ packets }) {
    const protocolTree = {};

    packets.forEach(pkt => {
        const protocols = pkt.protocol ? [pkt.protocol] : []; // Start with main protocol

        // You'd typically parse details to get nested protocols (e.g., Ethernet -> IP -> TCP/UDP/ICMP -> HTTP/DNS)
        // For simulation, let's just make a simple hierarchy.
        // A real implementation would parse packet.details much deeper.
        let currentLevel = protocolTree;
        if (pkt.details && pkt.details.ethernet && pkt.details.ethernet.type) {
             const ethType = pkt.details.ethernet.type;
             currentLevel[ethType] = currentLevel[ethType] || { count: 0, children: {} };
             currentLevel[ethType].count++;
             currentLevel = currentLevel[ethType].children;
        }

        if (pkt.details && pkt.details.ip && pkt.details.ip.protocol) {
            const ipProto = pkt.details.ip.protocol;
            currentLevel[ipProto] = currentLevel[ipProto] || { count: 0, children: {} };
            currentLevel[ipProto].count++;
            currentLevel = currentLevel[ipProto].children;
        }

        if (pkt.details && pkt.details.tcp && pkt.protocol === 'TCP') {
            currentLevel['TCP'] = currentLevel['TCP'] || { count: 0, children: {} };
            currentLevel['TCP'].count++;
            // Further drill down if TCP has app layer, e.g., HTTP
            if (pkt.details.http) {
                currentLevel['TCP'].children['HTTP'] = (currentLevel['TCP'].children['HTTP'] || { count: 0 }).count++;
            }
        } else if (pkt.details && pkt.details.udp && pkt.protocol === 'UDP') {
            currentLevel['UDP'] = currentLevel['UDP'] || { count: 0, children: {} };
            currentLevel['UDP'].count++;
            // Further drill down if UDP has app layer, e.g., DNS
            if (pkt.details.dns) {
                currentLevel['UDP'].children['DNS'] = (currentLevel['UDP'].children['DNS'] || { count: 0 }).count++;
            }
        } else if (pkt.details && pkt.details.icmp && pkt.protocol === 'ICMP') {
            currentLevel['ICMP'] = currentLevel['ICMP'] || { count: 0, children: {} };
            currentLevel['ICMP'].count++;
        } else {
             // Fallback for primary protocol if not parsed into details
             if (pkt.protocol && !protocols.includes(pkt.protocol)) {
                currentLevel[pkt.protocol] = currentLevel[pkt.protocol] || { count: 0, children: {} };
                currentLevel[pkt.protocol].count++;
             }
        }
    });

    const renderHierarchy = (node, level = 0) => {
        if (Object.keys(node).length === 0) return null;

        const sortedKeys = Object.keys(node).sort((a, b) => {
            const countA = node[a].count || 0;
            const countB = node[b].count || 0;
            return countB - countA; // Sort by count descending
        });

        return (
            <ul>
                {sortedKeys.map(protoName => {
                    const data = node[protoName];
                    const totalCountForLevel = Object.values(node).reduce((sum, item) => sum + (item.count || 0), 0);
                    const percentage = totalCountForLevel > 0 ? ((data.count / totalCountForLevel) * 100).toFixed(2) : 0;

                    return (
                        <li key={protoName} style={{ '--level': level }}>
                            <span className="protocol-name">{protoName}</span>
                            <span className="protocol-count">{data.count} packets</span>
                            <span className="protocol-percentage">({percentage}%)</span>
                            {data.children && Object.keys(data.children).length > 0 && (
                                renderHierarchy(data.children, level + 1)
                            )}
                        </li>
                    );
                })}
            </ul>
        );
    };


    return (
        <div className="stats-panel protocol-hierarchy-panel">
            <h3>Protocol Hierarchy</h3>
            {packets.length === 0 ? (
                <p className="no-data">No packets captured yet.</p>
            ) : (
                <div className="hierarchy-tree">
                    {renderHierarchy(protocolTree)}
                </div>
            )}
        </div>
    );
}