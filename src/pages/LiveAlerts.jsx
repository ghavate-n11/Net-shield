import React, { useEffect, useState } from 'react';
import stompClient from '../components/WebSocketClient'; // Adjust path if needed

function LiveAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Function to fetch initial alerts via REST API
    const fetchAlerts = () => {
      fetch('http://localhost:8080/api/logs')
        .then(res => res.json())
        .then(data => setAlerts(data))
        .catch(err => console.error('Fetch error:', err));
    };

    fetchAlerts(); // Initial fetch

    // Setup WebSocket subscription for live updates
    stompClient.onConnect = () => {
      stompClient.subscribe('/topic/scan', (message) => {
        const newAlert = JSON.parse(message.body);
        setAlerts(prev => [...prev, newAlert]);
      });
    };

    // Activate the STOMP client connection
    stompClient.activate();

    // Poll every 5 seconds as fallback to avoid missing alerts
    const intervalId = setInterval(fetchAlerts, 5000);

    // Cleanup function runs on component unmount
    return () => {
      clearInterval(intervalId);
      if (stompClient.connected) {
        stompClient.deactivate();
      }
    };
  }, []);

  return (
    <div>
      <h2>Live Security Alerts</h2>
      <ul>
        {alerts.map(alert => (
          <li key={alert.id || `${alert.ipAddress}-${alert.port}-${alert.protocol}`}>
            IP: {alert.ipAddress}, Port: {alert.port}, Protocol: {alert.protocol}, Status: {alert.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LiveAlerts;
