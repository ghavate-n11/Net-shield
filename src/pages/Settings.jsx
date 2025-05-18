import React, { useState } from 'react';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [packetLimit, setPacketLimit] = useState(100);
  const [captureInterface, setCaptureInterface] = useState('eth0');
  const [promiscuousMode, setPromiscuousMode] = useState(true);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>NetShield Settings</h2>

      {/* Theme Option */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          />
          Dark Mode
        </label>
      </div>

      {/* Auto-Scroll Option */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
          />
          Auto-scroll to latest packet
        </label>
      </div>

      {/* Capture Interface Dropdown */}
      <div>
        <label>
          Capture Interface:
          <select
            value={captureInterface}
            onChange={(e) => setCaptureInterface(e.target.value)}
          >
            <option value="eth0">Ethernet (eth0)</option>
            <option value="wlan0">Wi-Fi (wlan0)</option>
            <option value="lo">Loopback (lo)</option>
          </select>
        </label>
      </div>

      {/* Promiscuous Mode */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={promiscuousMode}
            onChange={(e) => setPromiscuousMode(e.target.checked)}
          />
          Enable Promiscuous Mode
        </label>
      </div>

      {/* Packet Limit */}
      <div>
        <label>
          Max Packets to Capture:
          <input
            type="number"
            value={packetLimit}
            onChange={(e) => setPacketLimit(parseInt(e.target.value, 10))}
            min="1"
            max="1000"
          />
        </label>
      </div>
    </div>
  );
}
