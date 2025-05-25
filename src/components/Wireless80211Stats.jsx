import React, { useEffect, useState } from 'react';

const Wireless80211Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/wireless80211-stats'); // Your backend API URL
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load wireless 802.11 stats');
        setLoading(false);
      }
    };

    fetchStats(); // Initial fetch

    const interval = setInterval(fetchStats, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading 802.11 Wireless stats...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>802.11 Wireless Stats (Live)</h1>
      <p>This page displays Wi-Fi related statistics (802.11 protocol) similar to Wireshark.</p>

      <table style={{ borderCollapse: 'collapse', width: '70%' }}>
        <tbody>
          <tr>
            <th style={thStyle}>Statistic</th>
            <th style={thStyle}>Value</th>
          </tr>
          <tr>
            <td style={tdStyle}>SSID</td>
            <td style={tdStyle}>{stats.ssid}</td>
          </tr>
          <tr>
            <td style={tdStyle}>BSSID (MAC Address)</td>
            <td style={tdStyle}>{stats.bssid}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Channel</td>
            <td style={tdStyle}>{stats.channel}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Signal Strength</td>
            <td style={tdStyle}>{stats.signalStrength}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Noise Level</td>
            <td style={tdStyle}>{stats.noiseLevel}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Packets Sent</td>
            <td style={tdStyle}>{stats.packetsSent}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Packets Received</td>
            <td style={tdStyle}>{stats.packetsReceived}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Data Rate</td>
            <td style={tdStyle}>{stats.dataRate}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Errors</td>
            <td style={tdStyle}>{stats.errors}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const thStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  backgroundColor: '#f2f2f2',
  textAlign: 'left',
};

const tdStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
};

export default Wireless80211Stats;
