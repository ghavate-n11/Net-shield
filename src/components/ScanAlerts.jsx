import React, { useEffect, useState } from 'react';
import stompClient from './WebSocketClient';

const ScanAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    stompClient.onConnect = () => {
      stompClient.subscribe('/topic/scan', (message) => {
        const newAlert = JSON.parse(message.body);
        setAlerts(prev => [...prev, newAlert]);
      });
    };

    stompClient.activate(); // Start the connection

    return () => {
      if (stompClient.connected) {
        stompClient.deactivate(); // Clean up when component unmounts
      }
    };
  }, []);

  return (
    <div>
      <h2>Live Scan Alerts</h2>
      <ul>
        {alerts.map((alert, index) => (
          <li key={index}>
            {alert.ipAddress} → {alert.port}/{alert.protocol} → {alert.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScanAlerts;
