// src/pages/WelcomePage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css'; // Ensure your CSS file is correctly linked

const WelcomePage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedInterfaces, setSelectedInterfaces] = useState({});
  const [recentCaptures, setRecentCaptures] = useState([]);
  const fileInputRef = useRef(null);

  // Define your interfaces
  const interfaces = [
    'Wi-Fi',
    'Loopback Interface',
    'Ethernet 1',
    'Ethernet 2',
    'Virtual Adapter',
  ];

  // List of valid protocol names for validation
  const validProtocols = ['tcp', 'udp', 'ip', 'icmp', 'arp', 'http', 'https', 'dns', 'ftp', 'ssh', 'telnet', 'smtp', 'pop3', 'imap', 'ipv6', 'icmpv6', 'tftp', 'sctp'];

  useEffect(() => {
    // Load recent captures from localStorage
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
    if (trimmed.includes(' ')) return false; // Accept only one protocol name with no spaces
    return validProtocols.includes(trimmed);
  };

  // When user clicks "Apply Filter"
  const handleApplyFilter = () => {
    if (!isValidFilter(filter)) {
      alert('⚠️ Please enter a correct protocol name (e.g., tcp, udp, ip).');
      return;
    }

    // Now, if the filter is valid, proceed to start capture directly
    handleStartCapture(true); // Pass true to indicate it's from "Apply Filter"
  };

  // When user clicks "Start Capture" or "Apply Filter" (now merged logic)
  const handleStartCapture = (fromApplyFilter = false) => {
    const activeInterfaces = Object.keys(selectedInterfaces).filter((iface) => selectedInterfaces[iface]);

    if (activeInterfaces.length === 0) {
      alert('⚠️ Please select at least one network interface.');
      return;
    }
    // Only re-validate if not coming from Apply Filter, as it's already validated there
    if (!fromApplyFilter && !isValidFilter(filter) && filter.trim() !== '') {
      alert('⚠️ Please correct the filter before starting capture (e.g., tcp, udp, ip).');
      return;
    }

    const filterName = filter.trim() === '' ? 'capture' : filter.trim();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const newCaptureName = `${filterName}_${timestamp}.pcap`;

    // Update recent captures list (max 5)
    const updatedCaptures = [newCaptureName, ...recentCaptures.slice(0, 4)];
    setRecentCaptures(updatedCaptures);
    localStorage.setItem('recentCaptures', JSON.stringify(updatedCaptures));

    // Navigate to dashboard with filter & interfaces info
    navigate('/dashboard', {
      state: { filter: filterName, interfaces: activeInterfaces, startLiveCapture: true }, // Added startLiveCapture flag
    });
  };

  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      alert(`File "${file.name}" selected. (In a real app, this would open for analysis)`);
    }
  };

  // This function simulates network traffic activity.
  // It renders a series of small, blinking elements.
  const renderInterfaceTraffic = (iface) => {
    const [trafficBars, setTrafficBars] = useState([]);

    useEffect(() => {
      // Simulate traffic by randomly adding/removing bars
      const interval = setInterval(() => {
        const newBars = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => i);
        setTrafficBars(newBars);
      }, 500 + Math.random() * 500); // Randomize interval slightly for variation

      return () => clearInterval(interval);
    }, [iface]);

    return (
      <div className="traffic-indicator">
        {trafficBars.map((_, index) => (
          <span key={index} className="traffic-bar" style={{ animationDelay: `${Math.random() * 0.5}s` }}></span>
        ))}
      </div>
    );
  };

  // Determine if the main "Start Capture" button should be disabled
  const isStartCaptureDisabled = !isValidFilter(filter) || Object.keys(selectedInterfaces).filter((i) => selectedInterfaces[i]).length === 0;

  return (
    <main className="welcome-page">
      <header className="welcome-header">
        <h1>
          🔒 WELCOME TO <span className="highlight">NET SHIELD</span> 🔒
        </h1>

        <div className="marquee-container">
          <p className="marquee-text">
            🔒 <strong>SEE THE UNSEEN. SECURE THE UNKNOWN.</strong> 🔒
          </p>
        </div>

        <p className="subtitle">
          A simple and powerful tool for capturing and analyzing your network traffic.
        </p>
      </header>

      <section className="capture-section">
        <h2>🎯 Start a New Capture</h2>

        <div className="filter-group">
          <label htmlFor="filter">Apply a filter (optional):</label>
          <div className="filter-input-wrapper">
            <input
              type="text"
              id="filter"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
              }}
              placeholder="Enter protocol name e.g., tcp"
              className={`filter-input ${!isValidFilter(filter) && filter.trim() !== '' ? 'invalid-input' : ''}`}
            />
            <button
              onClick={handleApplyFilter}
              className="apply-filter-btn"
              disabled={!isValidFilter(filter)} // Disable if filter is invalid
            >
              Apply Filter & Start
            </button>
          </div>
          {!isValidFilter(filter) && filter.trim() !== '' && (
            <small className="error-message">
              Invalid filter. Please enter a single valid protocol name (e.g., tcp, udp, ip).
            </small>
          )}
          <small className="hint">
            Tip: Use protocol names only (e.g., <code>tcp</code>, <code>udp</code>, <code>ip</code>).
          </small>
        </div>

        <div className="interface-list-section">
          <p className="interface-list-header">Select interfaces to capture from:</p>
          <div className="interface-list">
            {interfaces.map((iface, idx) => (
              <div key={idx} className="interface-item">
                <input
                  type="checkbox"
                  id={`iface-${idx}`}
                  checked={!!selectedInterfaces[iface]}
                  onChange={() => handleInterfaceChange(iface)}
                />
                <label htmlFor={`iface-${idx}`}>{iface}</label>
                {/* Traffic indicator next to interface name */}
                {renderInterfaceTraffic(iface)}
              </div>
            ))}
          </div>
        </div>

        <div className="actions">
          <button
            className="primary-btn"
            onClick={() => handleStartCapture(false)} // Explicitly indicate not from Apply Filter
            disabled={isStartCaptureDisabled}
            title={isStartCaptureDisabled ? 'Select interfaces and apply a valid filter to enable' : 'Start capturing network traffic'}
          >
            ▶ Start Capture
          </button>
          <button className="secondary-btn" onClick={handleOpenFile}>
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
          <ul className="recent-captures-list">
            {recentCaptures.map((cap, idx) => (
              <li key={idx} className="recent-capture-item">
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
            className="learn-link"
          >
            User’s Guide
          </a>{' '}
          •{' '}
          <a
            href="https://github.com/ghavate-n11/Net-shield.git"
            target="_blank"
            rel="noopener noreferrer"
            className="learn-link"
          >
            GitHub
          </a>{' '}
          •{' '}
          <a
            href="https://docs.google.com/document/d/1xVkZjEjDv7S-QWot7paW6px58NPiT9Docv5f5XwON04/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="learn-link"
          >
            FAQs
          </a>
        </nav>

        <p className="contact">
          <span className="contact-label">For all development queries, contact:</span>
          <br />
          <a href="mailto:nileshghavate11@gmail.com" target="_blank" rel="noopener noreferrer" className="contact-email">
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