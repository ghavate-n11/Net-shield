import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false);
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

  // List of valid protocol names for validation
  const validProtocols = ['tcp', 'udp', 'ip', 'icmp', 'arp', 'http', 'https', 'dns', 'ftp', 'ssh', 'telnet', 'smtp', 'pop3', 'imap'];

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

  // Validate filter input (only one protocol name allowed)
  const isValidFilter = (text) => {
    const trimmed = text.trim().toLowerCase();
    if (trimmed === '') return true; // empty filter allowed
    // Accept only one protocol name with no spaces
    if (trimmed.includes(' ')) return false;
    return validProtocols.includes(trimmed);
  };

  // When user clicks "Apply Filter" (sets filter applied state)
  const handleApplyFilter = () => {
    if (!isValidFilter(filter)) {
      alert('⚠️ Please enter a correct protocol name (e.g., tcp, udp, ip).');
      setIsFilterApplied(false);
      return;
    }
    setIsFilterApplied(true);
  };

  // When user clicks "INW" button to go to Dashboard and start capture
  const handleStartCapture = () => {
    const activeInterfaces = Object.keys(selectedInterfaces).filter((iface) => selectedInterfaces[iface]);

    if (activeInterfaces.length === 0) {
      alert('⚠️ Please select at least one network interface.');
      return;
    }

    const filterName = filter.trim() === '' ? 'capture' : filter.trim();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const newCapture = `${filterName}_${timestamp}.pcap`;

    // Update recent captures list (max 5)
    const updatedCaptures = [newCapture, ...recentCaptures.slice(0, 4)];
    setRecentCaptures(updatedCaptures);
    localStorage.setItem('recentCaptures', JSON.stringify(updatedCaptures));

    // Navigate to dashboard with filter & interfaces info
    navigate('/dashboard', {
      state: { filter: filterName, interfaces: activeInterfaces },
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

        {/* Running marquee-style line */}
        <div className="marquee-container">
          <p className="marquee-text">🔒 See the unseen. Secure the unknown. 🔒</p>
        </div>

        <p className="subtitle">
          A simple and powerful tool for capturing and analyzing your network traffic.
        </p>
      </header>

      <section className="capture-section">
        <h2>🎯 Start a New Capture</h2>

        <label htmlFor="filter">Apply a filter (optional):</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            id="filter"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              if (isFilterApplied) setIsFilterApplied(false);
            }}
            placeholder="Enter protocol name e.g., tcp"
            className="filter-input"
          />
          <button
            onClick={handleApplyFilter}
            className="apply-filter-btn"
          >
            Apply Filter
          </button>

          {isFilterApplied && (
            <button
              onClick={handleStartCapture}
              className="inw-btn"
              title="Go to Dashboard and Start Capture"
            >
              INW
            </button>
          )}
        </div>
        <small className="hint">
          Tip: Use protocol names only (e.g., <code>tcp</code>, <code>udp</code>, <code>ip</code>).
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
          <button
            className="primary"
            onClick={handleStartCapture}
            disabled={!isValidFilter(filter) || Object.keys(selectedInterfaces).filter((i) => selectedInterfaces[i]).length === 0}
          >
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
        {recentCaptures.length > 0 ? (
          <ul>
            {recentCaptures.map((cap, idx) => (
  <li key={idx}>
    {(typeof cap === 'string' ? cap : String(cap)).replace(/_/g, ' ').replace('.pcap', '')}
  </li>
))}

          </ul>
        ) : (
          <p className="no-captures">No recent captures found.</p>
        )}
      </section>

      <section className="learn-section">
        <h2>Learn & Support</h2>
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
