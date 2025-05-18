// src/pages/WelcomePage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedInterfaces, setSelectedInterfaces] = useState({});
  const [recentCaptures, setRecentCaptures] = useState([]);
  const fileInputRef = useRef(null);

  const interfaces = [
    'Wi-Fi',
    'Loopback Interface',
    'Ethernet 1',
    'Ethernet 2',
    'Virtual Adapter',
  ];

  useEffect(() => {
    const savedCaptures = JSON.parse(localStorage.getItem('recentCaptures')) || [];
    setRecentCaptures(savedCaptures);
  }, []);

  const handleInterfaceChange = (iface) => {
    setSelectedInterfaces((prev) => ({
      ...prev,
      [iface]: !prev[iface],
    }));
  };

  // Optional: Simple protocol validation if filter is only protocol names
  const validProtocols = ['tcp', 'udp', 'ip', 'icmp', 'arp'];

  const isValidFilter = (text) => {
    if (!text.trim()) return true; // empty allowed
    // If filter is one word and a valid protocol, allow
    const words = text.trim().toLowerCase().split(/\s+/);
    if (words.length === 1 && validProtocols.includes(words[0])) return true;
    // Otherwise, allow any non-empty filter (you can improve this with real BPF validation)
    return true;
  };

  const handleStartCapture = () => {
    if (!isValidFilter(filter)) {
      alert('⚠️ Please enter a valid protocol name or filter.');
      return;
    }

    const activeInterfaces = Object.keys(selectedInterfaces).filter(
      (iface) => selectedInterfaces[iface]
    );

    if (activeInterfaces.length === 0) {
      alert('⚠️ Please select at least one network interface.');
      return;
    }

    const newCapture = `${filter || 'capture'}_${new Date().toISOString()}.pcap`;
    const updatedCaptures = [newCapture, ...recentCaptures.slice(0, 4)];
    setRecentCaptures(updatedCaptures);
    localStorage.setItem('recentCaptures', JSON.stringify(updatedCaptures));

    navigate('/dashboard', {
      state: { filter, interfaces: activeInterfaces },
    });
  };

  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  const renderSignalStrength = (iface) => {
    const strength = Math.floor(Math.random() * 100);
    return (
      <span className="signal-strength" title={`${strength}%`}>
        📶 {strength}%
      </span>
    );
  };

  return (
    <main className="welcome-page">
      <header className="welcome-header">
        <h1>🔒 Welcome to <span className="highlight">Net Shield</span></h1>
        <p className="subtitle">
          A simple and powerful tool for capturing and analyzing your network traffic.
        </p>
      </header>

      <section className="capture-section">
        <h2>🎯 Start a New Capture</h2>
        <label htmlFor="filter">Apply a filter (optional):</label>
        <input
          type="text"
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="e.g., tcp port 80"
          className="filter-input"
        />
        <small className="hint">
          Tip: Use BPF syntax (like <code>ip</code>, <code>tcp</code>, <code>udp</code>, <code>port 80</code>)
        </small>

        <div className="interface-list">
          <p>Select interfaces to capture from:</p>
          {interfaces.map((iface, idx) => (
            <div key={idx} className="interface-item">
              <input
                type="checkbox"
                id={`iface-${idx}`}
                checked={!!selectedInterfaces[iface]}
                onChange={() => handleInterfaceChange(iface)}
              />
              <label htmlFor={`iface-${idx}`}>{iface}</label>
              {renderSignalStrength(iface)}
            </div>
          ))}
        </div>

        <div className="actions">
          <button className="primary" onClick={handleStartCapture}>
            ▶ Start Capture
          </button>
          <button className="secondary" onClick={handleOpenFile}>
            📂 Open a Capture File
          </button>
          <input
            type="file"
            accept=".pcap,.pcapng"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          {selectedFileName && (
            <p className="file-name">
              ✅ Selected file: <strong>{selectedFileName}</strong>
            </p>
          )}
        </div>
      </section>

      <section className="recent-captures">
        <h2>🕒 Recent Captures</h2>
        <ul>
          {recentCaptures.map((cap, idx) => (
            <li key={idx}>{cap}</li>
          ))}
        </ul>
      </section>

      <section className="learn-section">
        <h2>📘 Learn & Support</h2>
        <nav className="learn-links">
          <a
            href="https://docs.google.com/document/d/1dP_1R8nORHF93h0Z_4YJKpm-auunbWhDq4QHNJ2HdbI/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            User’s Guide
          </a> •{' '}
          <a
            href="https://github.com/ghavate-n11/Net-shield.git"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a> •{' '}
          <a
            href="https://docs.google.com/document/d/1xVkZjEjDv7S-QWot7paW6px58NPiT9Docv5f5XwON04/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            FAQs
          </a>
        </nav>
       <p className="contact">
  <span className="contact-label">For all development queries, contact:</span><br />
  <a href="mailto:nileshghavate11@gmail.com" target="_blank" rel="noopener noreferrer">
    nileshghavate11@gmail.com
  </a>
</p>


        <p className="version">
          You are using <strong>Net Shield v1.0.0</strong>
        </p>
      </section>
    </main>
  );
};

export default WelcomePage;
