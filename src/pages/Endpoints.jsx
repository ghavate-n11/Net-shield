// src/components/Endpoints.jsx
import React from 'react';
//import './Endpoints.css'; // Create this CSS file

export default function Endpoints({ packets }) {
    const endpoints = {}; // IP address -> { packets, bytes, protocols }

    packets.forEach(pkt => {
        const addEndpoint = (ip, isSource, length) => {
            if (!endpoints[ip]) {
                endpoints[ip] = { packets: 0, bytes: 0, protocols: {}, isSource: false, isDestination: false };
            }
            endpoints[ip].packets++;
            endpoints[ip].bytes += length;
            endpoints[ip].protocols[pkt.protocol] = (endpoints[ip].protocols[pkt.protocol] || 0) + 1;
            if (isSource) endpoints[ip].isSource = true;
            else endpoints[ip].isDestination = true;
        };

        if (pkt.source) {
            addEndpoint(pkt.source, true, pkt.length);
        }
        if (pkt.destination && pkt.source !== pkt.destination) { // Avoid double-counting if source == dest
            addEndpoint(pkt.destination, false, pkt.length);
        }
    });

    const endpointList = Object.entries(endpoints).map(([ip, data]) => ({ ip, ...data }))
                                .sort((a, b) => b.packets - a.packets); // Sort by packet count

    return (
        <div className="stats-panel endpoints-panel">
            <h3>Endpoints</h3>
            {endpointList.length === 0 ? (
                <p className="no-data">No endpoints found.</p>
            ) : (
                <div className="endpoint-list">
                    <div className="endpoint-header">
                        <span>Address</span>
                        <span>Role</span>
                        <span>Packets</span>
                        <span>Bytes</span>
                        <span>Protocols</span>
                    </div>
                    {endpointList.map((ep, index) => (
                        <div key={ep.ip} className="endpoint-item">
                            <span>{ep.ip}</span>
                            <span>
                                {ep.isSource && ep.isDestination ? 'Both' : ep.isSource ? 'Source' : 'Destination'}
                            </span>
                            <span>{ep.packets}</span>
                            <span>{ep.bytes}</span>
                            <span className="endpoint-protocols">
                                {Object.keys(ep.protocols).sort().join(', ')}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}