// src/components/Conversations.jsx
import React from 'react';
//import './Conversations.css'; // Create this CSS file

export default function Conversations({ packets }) {
    const conversations = {};

    packets.forEach(pkt => {
        const key = [pkt.source, pkt.destination, pkt.protocol].sort().join('-'); // Canonical key
        if (!conversations[key]) {
            conversations[key] = {
                source: pkt.source,
                destination: pkt.destination,
                protocol: pkt.protocol,
                packetCount: 0,
                byteCount: 0,
            };
        }
        conversations[key].packetCount++;
        conversations[key].byteCount += pkt.length || 0;
    });

    const conversationList = Object.values(conversations).sort((a, b) => b.packetCount - a.packetCount);

    return (
        <div className="stats-panel conversations-panel">
            <h3>Conversations</h3>
            {conversationList.length === 0 ? (
                <p className="no-data">No conversations found.</p>
            ) : (
                <div className="conversation-list">
                    <div className="conversation-header">
                        <span>Source</span>
                        <span>Destination</span>
                        <span>Protocol</span>
                        <span>Packets</span>
                        <span>Bytes</span>
                    </div>
                    {conversationList.map((conv, index) => (
                        <div key={index} className="conversation-item">
                            <span>{conv.source}</span>
                            <span>{conv.destination}</span>
                            <span>{conv.protocol}</span>
                            <span>{conv.packetCount}</span>
                            <span>{conv.byteCount}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}