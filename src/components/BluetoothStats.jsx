import React, { useEffect, useState } from 'react';

const BluetoothStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate fetching data or replace with real API call
  const fetchStats = async () => {
    try {
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 500));

      // Simulated data - replace with real backend data
      const exampleData = {
        connectedDevices: 4,
        packetsSent: 1530,
        packetsReceived: 1475,
        signalStrength: '-63 dBm',
        errors: 1,
        dataRate: '2 Mbps',
        channel: 37,
        protocolVersion: '5.0',
        powerLevel: '-4 dBm',
        latency: '20 ms',
        deviceDetails: [
          {
            address: '00:1A:7D:DA:71:11',
            status: 'Connected',
            profiles: ['Advanced Audio Distribution Profile (A2DP)', 'Hands-Free Profile (HFP)'],
          },
          {
            address: '00:1B:3F:AA:22:FF',
            status: 'Connected',
            profiles: ['Human Interface Device (HID) Profile'],
          },
          {
            address: '00:1C:4D:BB:33:EE',
            status: 'Pairing',
            profiles: ['Advanced Audio Distribution Profile (A2DP)'],
          },
          {
            address: '00:1D:5E:CC:44:DD',
            status: 'Connected',
            profiles: ['Hands-Free Profile (HFP)', 'Audio/Video Remote Control Profile (AVRCP)'],
          },
        ],
      };

      setStats(exampleData);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError('Failed to load Bluetooth stats');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(); // initial fetch

    // Poll every 5 seconds for live updates
    const intervalId = setInterval(fetchStats, 5000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <p>Loading Bluetooth stats...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      {/* Live Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span
          style={{
            display: 'inline-block',
            width: '14px',
            height: '14px',
            backgroundColor: 'red',
            borderRadius: '50%',
            animation: 'pulse 1.5s infinite',
          }}
          aria-label="Live indicator"
        />
        <span style={{ fontWeight: 'bold', color: 'red', fontSize: '18px' }}>Live</span>
      </div>

      <h1>Bluetooth Stats</h1>
      <p>This page displays live Bluetooth network statistics similar to Wireshark.</p>

      <table style={tableStyle}>
        <tbody>
          <tr>
            <th style={thStyle}>Statistic</th>
            <th style={thStyle}>Value</th>
          </tr>
          <tr>
            <td style={tdStyle}>Connected Devices</td>
            <td style={tdStyle}>{stats.connectedDevices}</td>
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
            <td style={tdStyle}>Signal Strength</td>
            <td style={tdStyle}>{stats.signalStrength}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Errors</td>
            <td style={tdStyle}>{stats.errors}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Data Rate</td>
            <td style={tdStyle}>{stats.dataRate}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Channel</td>
            <td style={tdStyle}>{stats.channel}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Protocol Version</td>
            <td style={tdStyle}>{stats.protocolVersion}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Power Level</td>
            <td style={tdStyle}>{stats.powerLevel}</td>
          </tr>
          <tr>
            <td style={tdStyle}>Latency</td>
            <td style={tdStyle}>{stats.latency}</td>
          </tr>
        </tbody>
      </table>

      <h2>Connected Devices Details</h2>
      {stats.deviceDetails && stats.deviceDetails.length > 0 ? (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Device Address</th>
              <th style={thStyle}>Connection Status</th>
              <th style={thStyle}>Active Profiles</th>
            </tr>
          </thead>
          <tbody>
            {stats.deviceDetails.map((device, index) => (
              <tr key={index}>
                <td style={tdStyle}>{device.address}</td>
                <td style={tdStyle}>{device.status}</td>
                <td style={tdStyle}>{device.profiles.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No connected devices found.</p>
      )}

      {/* CSS animation for pulse */}
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
  width: '70%',
  marginBottom: '30px',
  border: '3px solidrgb(22, 24, 27)',
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
const trHoverStyle = {
  transition: 'background-color 0.3s ease',
  cursor: 'default',
};


export default BluetoothStats;
