// src/pages/Alerts.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/alerts');
        setAlerts(response.data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const dismissAlert = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/alerts/${id}`);
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    } catch (error) {
      console.error('Error dismissing alert:', error);
    }
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1 style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#b30000'
      }}>
                🔴Live Security Alerts
      </h1>

      {alerts.length === 0 ? (
        <p style={{ color: 'gray' }}>No alerts at this time.</p>
      ) : (
        <ul style={{ paddingLeft: '1.5rem', color: '#660000' }}>
          {alerts.map(alert => (
            <li
              key={alert.id}
              style={{
                backgroundColor: '#ffe6e6',
                padding: '1rem',
                marginBottom: '1rem',
                borderLeft: '5px solid red',
                borderRadius: '6px',
                listStyleType: 'disc',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{alert.title}</strong>
                  <div style={{ fontSize: '0.85rem', color: '#990000' }}>{alert.timestamp}</div>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  style={{
                    backgroundColor: '#cc0000',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Dismiss
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Alerts;
