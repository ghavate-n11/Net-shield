import React, { useState, useEffect, useRef } from 'react';

const menuStructure = [
  { label: 'File', submenu: ['Open', 'Merge', 'Save', 'Print', 'Export', 'Quit'] },
  { label: 'Edit', submenu: ['Find Packet', 'Set Time Reference', 'Mark Packet', 'Preferences'] },
  { label: 'View', submenu: ['Colorize Packets', 'Zoom In', 'Zoom Out', 'Packet Details'] },
  { label: 'Go', submenu: ['Go to Packet'] },
  { label: 'Capture', submenu: ['Start', 'Stop', 'Edit Filters'] },
  { label: 'Analyze', submenu: ['Display Filters', 'Enable Protocol', 'Decode As', 'Follow TCP Stream'] },
  { label: 'Statistics', submenu: ['Summary', 'Protocol Hierarchy', 'Conversations', 'Endpoints'] },
  { label: 'Telephony', submenu: ['VoIP Calls', 'SIP Flows', 'RTP Streams'] },
  { label: 'Wireless', submenu: ['Bluetooth Stats', '802.11 Stats'] },
  { label: 'Tools', submenu: ['Firewall ACL Rules'] },
  {
    label: 'Help',
    submenu: [
      "User's Guide",
      'GitHub',
      'FAQs',
      'About',
    ],
  },
];

const helpLinks = {
  "User's Guide": 'https://docs.google.com/document/d/1dP_1R8nORHF93h0Z_4YJKpm-auunbWhDq4QHNJ2HdbI/edit?usp=sharing',
  GitHub: 'https://github.com/ghavate-n11/Net-shield.git',
  FAQs: 'https://docs.google.com/document/d/1xVkZjEjDv7S-QWot7paW6px58NPiT9Docv5f5XwON04/edit?usp=sharing',
};

const MenuBar = () => {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [focusedSubIndex, setFocusedSubIndex] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showAbout, setShowAbout] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const fileInputRef = useRef(null);
  const menuBarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuBarRef.current && !menuBarRef.current.contains(event.target)) {
        setOpenMenuIndex(null);
        setFocusedSubIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (openMenuIndex === null) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setOpenMenuIndex(0);
        setFocusedSubIndex(0);
      }
      return;
    }

    const submenuLength = menuStructure[openMenuIndex].submenu.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedSubIndex((prev) =>
          prev === null || prev === submenuLength - 1 ? 0 : prev + 1
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedSubIndex((prev) =>
          prev === null || prev === 0 ? submenuLength - 1 : prev - 1
        );
        break;
      case 'ArrowRight':
        e.preventDefault();
        setOpenMenuIndex((prev) => (prev === menuStructure.length - 1 ? 0 : prev + 1));
        setFocusedSubIndex(0);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setOpenMenuIndex((prev) => (prev === 0 ? menuStructure.length - 1 : prev - 1));
        setFocusedSubIndex(0);
        break;
      case 'Escape':
        e.preventDefault();
        setOpenMenuIndex(null);
        setFocusedSubIndex(null);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedSubIndex !== null) handleMenuAction(openMenuIndex, focusedSubIndex);
        break;
      default:
        break;
    }
  };

  const handleMenuClick = (index) => {
    if (openMenuIndex === index) {
      setOpenMenuIndex(null);
      setFocusedSubIndex(null);
    } else {
      setOpenMenuIndex(index);
      setFocusedSubIndex(0);
    }
  };

  const handleMouseEnterMenu = (index) => {
    if (openMenuIndex !== null && openMenuIndex !== index) {
      setOpenMenuIndex(index);
      setFocusedSubIndex(0);
    }
  };

  const handleMenuAction = (menuIndex, subIndex) => {
    const menu = menuStructure[menuIndex];
    const action = menu.submenu[subIndex];

    setOpenMenuIndex(null);
    setFocusedSubIndex(null);

    switch (`${menu.label}:${action}`) {
      case 'File:Open':
        fileInputRef.current.click();
        break;
      case 'View:Zoom In':
        setZoomLevel((z) => Math.min(z + 0.1, 2));
        break;
      case 'View:Zoom Out':
        setZoomLevel((z) => Math.max(z - 0.1, 0.5));
        break;
      case 'Capture:Start':
        setCapturing(true);
        alert('Capture started (simulated)');
        break;
      case 'Capture:Stop':
        setCapturing(false);
        alert('Capture stopped (simulated)');
        break;
      case 'Help:About':
        setShowAbout(true);
        break;
      default:
        if (menu.label === 'Help' && helpLinks[action]) {
          window.open(helpLinks[action], '_blank', 'noopener,noreferrer');
          return;
        }
        alert(`${menu.label} → ${action} clicked`);
    }
  };

  return (
    <div>
      {/* Menu Bar */}
      <div
        ref={menuBarRef}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="menubar"
        aria-label="Application menu"
        style={{
          userSelect: 'none',
          fontFamily: 'Segoe UI',
          backgroundColor: '#222',
          color: '#eee',
          display: 'flex',
          padding: '5px 10px',
        }}
      >
        {menuStructure.map((menu, idx) => (
          <div
            key={menu.label}
            onClick={() => handleMenuClick(idx)}
            onMouseEnter={() => handleMouseEnterMenu(idx)}
            role="menuitem"
            aria-haspopup="true"
            aria-expanded={openMenuIndex === idx}
            tabIndex={openMenuIndex === idx ? 0 : -1}
            style={{
              padding: '5px 10px',
              cursor: 'pointer',
              backgroundColor: openMenuIndex === idx ? '#444' : 'transparent',
              position: 'relative',
            }}
          >
            {menu.label}
            {openMenuIndex === idx && (
              <ul
                role="menu"
                aria-label={`${menu.label} submenu`}
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: '5px 0',
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: '#333',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.8)',
                  zIndex: 1000,
                  minWidth: 150,
                }}
              >
                {menu.submenu.map((item, subIdx) => (
                  <li
                    key={item}
                    role="menuitem"
                    tabIndex={focusedSubIndex === subIdx ? 0 : -1}
                    onClick={() => handleMenuAction(idx, subIdx)}
                    onMouseEnter={() => setFocusedSubIndex(subIdx)}
                    style={{
                      padding: '6px 15px',
                      backgroundColor: focusedSubIndex === subIdx ? '#666' : 'transparent',
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* File Picker */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => alert(`File selected: ${e.target.files[0]?.name}`)}
      />

      {/* About Modal */}
      {showAbout && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-title"
          onClick={() => setShowAbout(false)}
        >
          <div
            style={{
              backgroundColor: '#222',
              color: '#eee',
              padding: 20,
              borderRadius: 8,
              maxWidth: 500,
              lineHeight: 1.6,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="about-title">About Net Shield Web Application</h2>

<p style={{ fontSize: '16px', lineHeight: '1.6', color: '#777' }}>
  <strong>Net Shield</strong> <em>(v1.0.0)</em> is a modern, full-stack web application designed as a
  <strong> Network Sniffing and Security Analyzer</strong>, offering real-time network monitoring,
  traffic analysis, and protection against potential threats. This system enables users to understand
  their network activity, detect anomalies, and maintain cybersecurity compliance. 
  <strong> Net Shield</strong> delivers a fast, interactive, and secure experience for network administrators,
  researchers, and cybersecurity enthusiasts.
</p>

<h2>Technology Stack</h2>
<ul style={{ fontSize: '16px', color: '#555' }}>
  <li><strong>Backend:</strong> Spring Boot (Java) – Version 3.2</li>
  <li><strong>Frontend:</strong> React.js – Version 18</li>
  <li><strong>Database:</strong> MySQL – Version 8.0</li>
</ul>

<h3>Developed By</h3>
<p style={{ fontSize: '16px', color: '#999' }}>
  <strong>Nilesh Ghavate</strong> as part of MCA
coursework at SVERI's College of Engineering, Pandharpur.
</p>



            <button
              style={{
                marginTop: 15,
                padding: '8px 12px',
                backgroundColor: '#444',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
              }}
              onClick={() => setShowAbout(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuBar;
