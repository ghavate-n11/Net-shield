import React, { useEffect, useState, useRef } from 'react';

const Wireless80211Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(false);

  const prevStatsRef = useRef(null);

  // Simple deep compare for stats objects
  const isStatsEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  const fetchStats = async () => {
    try {
      // Simulate fetch delay
      await new Promise(r => setTimeout(r, 500));

      // Mock data simulating wireless 802.11 stats
      const exampleData = {
        ssid: 'Home_WiFi_24GHz',
        bssid: 'AC:DE:48:00:11:22',
        signalStrength: '-55 dBm',
        channel: 6,
        frequency: '2.437 GHz',
        txRate: '54 Mbps',
        rxRate: '48 Mbps',
        packetsSent: 12500,
        packetsReceived: 12230,
        errors: 0,
        noiseLevel: '-92 dBm',
        security: 'WPA2-PSK',
        clients: [
          {
            macAddress: '00:0A:95:9D:68:16',
            ipAddress: '192.168.1.10',
            connectionStatus: 'Connected',
            signal: '-58 dBm',
            txRate: '54 Mbps',
            rxRate: '48 Mbps',
          },
          {
            macAddress: '00:0B:86:5F:34:22',
            ipAddress: '192.168.1.12',
            connectionStatus: 'Connected',
            signal: '-62 dBm',
            txRate: '36 Mbps',
            rxRate: '24 Mbps',
          },
        ],
      };

      if (prevStatsRef.current && !isStatsEqual(prevStatsRef.current, exampleData)) {
        setIsLive(true);
      } else {
        setIsLive(false);
      }

      prevStatsRef.current = exampleData;
      setStats(exampleData);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError('Failed to load wireless stats');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const intervalId = setInterval(fetchStats, 5000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <p>Loading 802.11 Wireless stats...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      {isLive && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span
            style={{
              display: 'inline-block',
              width: 14,
              height: 14,
              backgroundColor: 'red',
              borderRadius: '50%',
              animation: 'pulse 1.5s infinite',
            }}
            aria-label="Live indicator"
          />
          <span style={{ fontWeight: 'bold', color: 'red', fontSize: 18 }}>Live</span>
        </div>
      )}

      <h1>802.11 Wireless Stats</h1>
      <p>Live Wi-Fi network statistics inspired by Wireshark.</p>

      <table style={tableStyle}>
        <tbody>
          <tr><th style={thStyle}>SSID</th><td style={tdStyle}>{stats.ssid}</td></tr>
          <tr><th style={thStyle}>BSSID (MAC)</th><td style={tdStyle}>{stats.bssid}</td></tr>
          <tr><th style={thStyle}>Signal Strength</th><td style={tdStyle}>{stats.signalStrength}</td></tr>
          <tr><th style={thStyle}>Channel</th><td style={tdStyle}>{stats.channel}</td></tr>
          <tr><th style={thStyle}>Frequency</th><td style={tdStyle}>{stats.frequency}</td></tr>
          <tr><th style={thStyle}>Tx Rate</th><td style={tdStyle}>{stats.txRate}</td></tr>
          <tr><th style={thStyle}>Rx Rate</th><td style={tdStyle}>{stats.rxRate}</td></tr>
          <tr><th style={thStyle}>Packets Sent</th><td style={tdStyle}>{stats.packetsSent}</td></tr>
          <tr><th style={thStyle}>Packets Received</th><td style={tdStyle}>{stats.packetsReceived}</td></tr>
          <tr><th style={thStyle}>Errors</th><td style={tdStyle}>{stats.errors}</td></tr>
          <tr><th style={thStyle}>Noise Level</th><td style={tdStyle}>{stats.noiseLevel}</td></tr>
          <tr><th style={thStyle}>Security</th><td style={tdStyle}>{stats.security}</td></tr>
        </tbody>
      </table>

      <h2>Connected Clients</h2>
      {stats.clients && stats.clients.length > 0 ? (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>MAC Address</th>
              <th style={thStyle}>IP Address</th>
              <th style={thStyle}>Connection Status</th>
              <th style={thStyle}>Signal</th>
              <th style={thStyle}>Tx Rate</th>
              <th style={thStyle}>Rx Rate</th>
            </tr>
          </thead>
          <tbody>
            {stats.clients.map((client, idx) => (
              <tr key={idx}>
                <td style={tdStyle}>{client.macAddress}</td>
                <td style={tdStyle}>{client.ipAddress}</td>
                <td style={tdStyle}>{client.connectionStatus}</td>
                <td style={tdStyle}>{client.signal}</td>
                <td style={tdStyle}>{client.txRate}</td>
                <td style={tdStyle}>{client.rxRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No connected clients found.</p>
      )}

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const tableStyle = {
  borderCollapse: 'collapse',
  width: '80%',
  marginBottom: '30px',
  border: '3px solid #16445b',
};

const thStyle = {
  border: '3px solid #0B3D91',
  padding: '10px',
  backgroundColor: '#f9f9f9',
  textAlign: 'left',
  fontWeight: 'bold',
  color: '#0B3D91',
};

const tdStyle = {
  border: '2px solid #0B3D91',
  padding: '8px',
  textAlign: 'left',
};

export default Wireless80211Stats;
