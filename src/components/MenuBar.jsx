import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard.jsx'; // Corrected: Dashboard is in the 'pages' directory

const menuStructure = [
  { label: 'File', submenu: ['Open', 'Save', 'Print', 'Quit'] },
  { label: 'Edit', submenu: ['Find Packet', 'Set Time Reference', 'Mark Packet', 'Preferences'] },
  { label: 'View', submenu: ['Zoom In', 'Zoom Out', 'Packet Details', 'Toolbar', 'Status Bar'] },
  { label: 'Go', submenu: ['Go to Packet', 'First Packet', 'Last Packet', 'Previous Packet', 'Next Packet'] },
  { label: 'Capture', submenu: ['Start', 'Stop', 'Options', 'Interfaces'] },
  { label: 'Analyze', submenu: ['Display Filters', 'Enable Protocol', 'Decode As', 'Expert Information'] },
  { label: 'Statistics', submenu: ['Summary', 'Protocol Hierarchy', 'Conversations', 'Endpoints', 'IO Graphs'] },
  { label: 'Telephony', submenu: ['VoIP Calls', 'SIP Flows', 'RTP Streams'] },
  { label: 'Wireless', submenu: ['Bluetooth Stats', '802.11 Stats'] },
  { label: 'Tools', submenu: ['Firewall ACL Rules', 'Create Shortcut'] },
  { label: 'Help', submenu: ["User's Guide", 'GitHub', 'FAQs', 'About'] },
];

const helpLinks = {
  "User's Guide": 'https://docs.google.com/document/d/1dP_1R8nORHF93h0Z_4YJKpm-auunbWhDq4QHNJ2HdbI/edit?usp=sharing',
  GitHub: 'https://github.com/ghavate-n11/Net-shield.git',
  FAQs: 'https://docs.google.com/document/d/1xVkZjEjDv7S-QWot7paW6px58NPiT9Docv5f5XwON04/edit?usp=sharing',
};

// MenuBar component now accepts props for capture control
const MenuBar = ({ isCapturing, onStartCapture, onStopCapture, capturedPackets, onFilterChange, onSearchTermChange }) => {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [focusedSubIndex, setFocusedSubIndex] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showAbout, setShowAbout] = useState(false);
  const [displayFilter, setDisplayFilter] = useState(''); // State for local filter input

  const fileInputRef = useRef(null);
  const menuBarRef = useRef(null);
  const navigate = useNavigate();

  // Effect for handling clicks outside the menu
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

  // Keyboard navigation for menu
  const handleKeyDown = useCallback((e) => {
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
  }, [openMenuIndex, focusedSubIndex]); // Include dependencies

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

  // Main handler for all menu actions
  const handleMenuAction = (menuIndex, subIndex) => {
    const menu = menuStructure[menuIndex];
    const action = menu.submenu[subIndex];

    setOpenMenuIndex(null);
    setFocusedSubIndex(null);

    switch (`${menu.label}:${action}`) {
      case 'File:Open':
        fileInputRef.current.click();
        break;
      case 'File:Save':
        if (capturedPackets.length === 0) {
          alert('No captured data to save!');
          return;
        }
        saveCapturedData();
        break;
      case 'File:Print':
        window.print();
        break;
      case 'File:Quit':
        if (window.confirm('Are you sure you want to quit?')) {
          window.close();
        }
        break;
      case 'Edit:Find Packet':
        const packetId = prompt('Enter Packet ID to find:');
        if (packetId) {
          const foundPacket = capturedPackets.find(p => p.id === parseInt(packetId));
          if (foundPacket) {
            alert(`Found Packet: ID ${foundPacket.id}, Protocol: ${foundPacket.protocol}`);
          } else {
            alert(`Packet with ID ${packetId} not found.`);
          }
        }
        break;
      case 'Edit:Set Time Reference':
        alert('Time reference set (simulated).');
        break;
      case 'Edit:Mark Packet':
        const markPacketId = prompt('Enter Packet ID to mark/unmark:');
        if (markPacketId) {
          // This would ideally interact with Dashboard's state
          alert(`Packet ${markPacketId} marked/unmarked (simulated).`);
        }
        break;
      case 'Edit:Preferences':
        alert('Opening preferences dialog (simulated).');
        break;
      case 'View:Zoom In':
        setZoomLevel((z) => Math.min(z + 0.1, 2));
        break;
      case 'View:Zoom Out':
        setZoomLevel((z) => Math.max(z - 0.1, 0.5));
        break;
      case 'View:Packet Details':
        alert('Displaying packet details panel (simulated).');
        break;
      case 'View:Toolbar':
        alert('Toggle Toolbar visibility (simulated).');
        break;
      case 'View:Status Bar':
        alert('Toggle Status Bar visibility (simulated).');
        break;
      case 'Go:Go to Packet':
        const goToId = prompt('Enter Packet ID to go to:');
        if (goToId) {
          const targetPacket = capturedPackets.find(p => p.id === parseInt(goToId));
          if (targetPacket) {
            alert(`Navigating to Packet ID: ${targetPacket.id}`);
          } else {
            alert(`Packet with ID ${goToId} not found.`);
          }
        }
        break;
      case 'Go:First Packet':
        if (capturedPackets.length > 0) alert(`Navigating to First Packet: ID ${capturedPackets[0].id}`);
        else alert('No packets captured.');
        break;
      case 'Go:Last Packet':
        if (capturedPackets.length > 0) alert(`Navigating to Last Packet: ID ${capturedPackets[capturedPackets.length - 1].id}`);
        else alert('No packets captured.');
        break;
      case 'Go:Previous Packet':
        alert('Navigating to previous packet (simulated).');
        break;
      case 'Go:Next Packet':
        alert('Navigating to next packet (simulated).');
        break;
      case 'Capture:Start':
        onStartCapture(); // Call the prop function
        break;
      case 'Capture:Stop':
        onStopCapture(); // Call the prop function
        break;
      case 'Capture:Options':
        alert('Opening capture options (simulated).');
        break;
      case 'Capture:Interfaces':
        alert('Showing available network interfaces (simulated).');
        break;
      case 'Analyze:Display Filters':
        alert('Applying display filters (use the input field below to type filters).');
        break;
      case 'Analyze:Enable Protocol':
        const protocol = prompt('Enter protocol to enable/disable (e.g., HTTP, TCP):');
        if (protocol) alert(`Toggling ${protocol} protocol (simulated).`);
        break;
      case 'Analyze:Decode As':
        alert('Decoding packet as a different protocol (simulated).');
        break;
      case 'Analyze:Expert Information':
        alert('Displaying expert information (simulated).');
        break;
      case 'Statistics:Summary':
        navigate('/statistics/summary');
        break;
      case 'Statistics:Protocol Hierarchy':
        navigate('/statistics/protocol-hierarchy');
        break;
      case 'Statistics:Conversations':
        navigate('/statistics/conversations');
        break;
      case 'Statistics:Endpoints':
        navigate('/statistics/endpoints');
        break;
      case 'Statistics:IO Graphs':
        alert('Displaying I/O Graphs (simulated).');
        break;
      case 'Telephony:VoIP Calls':
        navigate('/voip-calls');
        break;
      case 'Telephony:SIP Flows':
        navigate('/sip-flows');
        break;
      case 'Telephony:RTP Streams':
        navigate('/rtp-streams');
        break;
      case 'Wireless:Bluetooth Stats':
        navigate('/bluetooth-stats');
        break;
      case 'Wireless:802.11 Stats':
        navigate('/wireless-80211-stats');
        break;
      case 'Tools:Firewall ACL Rules':
        navigate('/firewall-Rules');
        break;
      case 'Tools:Create Shortcut':
        alert('Creating application shortcut (simulated).');
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

  const saveCapturedData = () => {
    // Convert captured packets array to a string for saving
    const dataToSave = capturedPackets.map(p =>
      `ID: ${p.id}, Time: ${p.timestamp}, Source: ${p.source}, Destination: ${p.destination}, Protocol: ${p.protocol}, Length: ${p.length}, Info: ${p.info}${p.marked ? ' (MARKED)' : ''}`
    ).join('\n');

    const blob = new Blob([dataToSave], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NetShield_Capture_${new Date().toISOString().replace(/:/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };


  return (
    <div style={styles.menuContainer}>
      {/* Menu Bar */}
      <div
        ref={menuBarRef}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="menubar"
        aria-label="Application menu"
        style={styles.menuBar}
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
              ...styles.menuItem,
              ...(openMenuIndex === idx ? styles.menuItemActive : {}),
            }}
          >
            {menu.label}
            {openMenuIndex === idx && (
              <ul
                role="menu"
                aria-label={`${menu.label} submenu`}
                style={styles.submenu}
              >
                {menu.submenu.map((item, subIdx) => (
                  <li
                    key={item}
                    role="menuitem"
                    tabIndex={focusedSubIndex === subIdx ? 0 : -1}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent closing menu immediately after click
                      handleMenuAction(idx, subIdx);
                    }}
                    onMouseEnter={() => setFocusedSubIndex(subIdx)}
                    style={{
                      ...styles.submenuItem,
                      ...(focusedSubIndex === subIdx ? styles.submenuItemSelected : {}),
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

      {/* Main Content Area - Now contains the Dashboard */}
      <div style={styles.mainContentArea}>
        {/* Render the Dashboard component here */}
        <Dashboard
          isCapturing={isCapturing} // Pass down the capturing state
          onStartCapture={onStartCapture} // Pass start capture function
          onStopCapture={onStopCapture} // Pass stop capture function
          capturedPackets={capturedPackets} // Pass captured packets to Dashboard
          onFilterChange={onFilterChange} // Pass filter change handler to Dashboard
          onSearchTermChange={onSearchTermChange} // Pass search term change handler to Dashboard
        />
      </div>

      {/* Hidden File Input for Open */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            alert(`Selected file: ${file.name}`);
            // In a real application, you'd parse the file content here
          }
          e.target.value = ''; // Clear the input so same file can be selected again
        }}
      />

      {/* About Dialog */}
      {showAbout && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-title"
          style={styles.aboutDialogOverlay}
          onClick={() => setShowAbout(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={styles.aboutDialogContent}
          >
            {/* Project Logo */}
            <img
              src="src/assets/Logo.png"
              alt="NetShield Logo"
              style={styles.aboutDialogLogo}
            />

            <h2 id="about-title" style={styles.aboutDialogTitle}>About Net Shield</h2>
            <p style={styles.aboutDialogText}><strong>Version:</strong> Net Shield v1.0.0</p>
            <p style={styles.aboutDialogText}><strong>Domain:</strong> Cybersecurity / Network Security</p>

            <p style={styles.aboutDialogLongText}>
              <strong>Developed By:</strong> Nilesh B. Ghavate (MCA Final Year, SVERI's COE, Pandharpur [PAH Solapur University, Solapur])
            </p>

            <p style={styles.aboutDialogLongText}>
              <strong>Project Purpose:</strong> Net Shield is a web-based network packet capturing tool designed to help users monitor and analyze network traffic for troubleshooting and security auditing.
              It is useful for identifying suspicious activity, diagnosing network issues, ensuring compliance with security policies, and gaining insights into network performance.
            </p>
            <p style={styles.aboutDialogBoldText}>Key Features:</p>
            <ul style={styles.aboutDialogList}>
              <li style={styles.aboutDialogListItem}>Capture and display real-time network packets (simulated).</li>
              <li style={styles.aboutDialogListItem}>Start and stop capturing sessions easily.</li>
              <li style={styles.aboutDialogListItem}>Save captured data for offline analysis.</li>
              <li style={styles.aboutDialogListItem}>User-friendly interface with zoom functionality.</li>
              <li style={styles.aboutDialogListItem}>Basic packet filtering capabilities.</li>
            </ul>

            <p style={styles.aboutDialogBoldText}>Technologies Used:</p>
            <ul style={styles.aboutDialogList}>
              <li style={styles.aboutDialogListItem}>React.js for frontend UI development.</li>
              <li style={styles.aboutDialogListItem}>Spring Boot for backend APIs (planned integration).</li>
              <li style={styles.aboutDialogListItem}>MySQL for database management (planned integration).</li>
              <li style={styles.aboutDialogListItem}>Nmap tool for packet capture (planned integration).</li>
              <li style={styles.aboutDialogListItem}>Inspired by Wireshark.</li>
            </ul>

            {/* Developer Photo */}
            <img
              src="src/assets/images/Screenshot 2025-05-10 181434.png"
              alt="Developer"
              style={styles.developerPhoto}
            />

            {/* Name & Role */}
            <div style={styles.developerInfo}>
              <h3 style={styles.developerName}>Nilesh Ghavate</h3>
              <p style={styles.developerRole}>
                Java Full Stack Developer Intern
              </p>
            </div>

            {/* Social Links */}
            <div style={styles.socialLinksContainer}>
              {/* GitHub Image Link */}
              <a
                href="https://github.com/ghavate-n11"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
              >
                <img
                  src="src/assets/images/github.png"
                  alt="GitHub"
                  style={styles.socialIcon}
                />
              </a>

              {/* LinkedIn Image Link */}
              <a
                href="https://www.linkedin.com/in/nileshghavate-203b27251/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
              >
                <img
                  src="src/assets/images/linkedin.png"
                  alt="LinkedIn"
                  style={styles.socialIcon}
                />
              </a>

              {/* HackerRank Image Link */}
              <a
                href="https://www.hackerrank.com/profile/nileshghavate11"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="HackerRank Profile"
              >
                <img
                  src="src/assets/images/HackerRank_Icon-1000px.png"
                  alt="HackerRank"
                  style={styles.socialIcon}
                />
              </a>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowAbout(false)}
              style={styles.closeButton}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Consolidated Styles Object
const styles = {
  menuContainer: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#0f172a', /* Deep navy */
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    minHeight: '100vh', // Ensure it takes full viewport height
    color: '#333', // Default text color for main content
  },
  menuBar: {
    display: 'flex',
    backgroundColor: '#1e293b', /* Slate blue */
    padding: '0.75rem 1rem',
    borderBottom: '2px solid #334155',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
  },
  menuItem: {
    marginRight: '1.5rem',
    color: '#cbd5e1', /* Light gray-blue */
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '1rem',
    padding: '0.25rem 0.5rem',
    borderRadius: '6px',
    transition: 'background-color 0.2s ease, color 0.2s ease',
    position: 'relative', // For submenu positioning
    outline: 'none', // Remove default outline
  },
  menuItemActive: {
    backgroundColor: '#334155',
    color: '#60a5fa', /* Sky blue */
  },
  submenu: {
    listStyle: 'none',
    margin: 0,
    padding: '0.5rem 0',
    position: 'absolute',
    top: '100%', // Position below the menu item
    left: 0,
    backgroundColor: '#1e293b',
    border: '1px solid #475569',
    borderRadius: '8px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    minWidth: '220px',
    zIndex: 999,
  },
  submenuItem: {
    padding: '0.6rem 1rem',
    color: '#e2e8f0', /* Light text */
    cursor: 'pointer',
    fontSize: '0.95rem',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease, color 0.2s ease',
    whiteSpace: 'nowrap', // Prevent text wrapping
    outline: 'none', // Remove default outline
  },
  submenuItemSelected: {
    backgroundColor: '#334155',
    color: '#38bdf8', /* Bright cyan */
  },
  mainContentArea: {
    padding: '0', // Removed padding here, as Dashboard handles its own padding
    backgroundColor: '#f1f5f9', // Lighter background for content
    flexGrow: 1, // Allow content to expand
    overflowY: 'auto', // Enable scrolling for content if it overflows
    display: 'flex', // Make it a flex container
    flexDirection: 'column', // Stack children vertically
    height: 'calc(100vh - 65px)', // Ensure it takes remaining height (adjust 65px if menuBar height changes)
  },
  captureStatus: {
    marginBottom: '15px',
    padding: '10px',
    borderRadius: '5px',
    fontWeight: 'bold',
  },
  filterInputContainer: {
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
  },
  filterLabel: {
    marginRight: '10px',
    fontWeight: 'bold',
    color: '#555',
  },
  filterInputField: {
    width: 'calc(100% - 150px)',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
  },
  applyFilterButton: {
    marginLeft: '10px',
    padding: '8px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s ease',
  },
  packetDisplayTableContainer: {
    marginTop: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflowX: 'auto',
    backgroundColor: '#fff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  packetTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  packetTableHeader: {
    backgroundColor: '#e0e0e0',
    position: 'sticky',
    top: 0,
  },
  tableHeaderCell: {
    padding: '12px 15px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
    fontWeight: 'bold',
    color: '#444',
  },
  tableRow: {
    borderBottom: '1px solid #eee',
    // Background color for marked packets is handled dynamically
  },
  tableCell: {
    padding: '10px 15px',
    borderBottom: '1px solid #eee',
  },
  noPacketsMessage: {
    textAlign: 'center',
    padding: '20px',
    color: '#888',
  },
  aboutDialogOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '20px',
  },
  aboutDialogContent: {
    backgroundColor: '#fff',
    color: '#000',
    padding: '25px',
    borderRadius: '12px',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
    overflowY: 'auto',
    maxHeight: '90vh',
  },
  aboutDialogLogo: {
    width: '100px',
    marginBottom: '10px',
    borderRadius: '8px',
  },
  aboutDialogTitle: {
    color: '#222',
    marginBottom: '15px',
  },
  aboutDialogText: {
    margin: '8px 0',
  },
  aboutDialogLongText: {
    margin: '15px 0',
    lineHeight: '1.6',
  },
  aboutDialogBoldText: {
    margin: '15px 0',
    fontWeight: 'bold',
  },
  aboutDialogList: {
    textAlign: 'left',
    margin: '0 auto 20px',
    maxWidth: '90%',
    listStyleType: 'disc',
    paddingLeft: '20px',
  },
  aboutDialogListItem: {
    marginBottom: '5px',
  },
  developerPhoto: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    marginBottom: '10px',
    objectFit: 'cover',
    border: '2px solid #222',
  },
  developerInfo: {
    marginBottom: '15px',
  },
  developerName: {
    margin: '5px 0',
    color: '#333',
  },
  developerRole: {
    margin: 0,
    fontWeight: '500',
    color: '#555',
  },
  socialLinksContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '10px',
  },
  socialIcon: {
    width: '28px',
    height: '28px',
  },
  closeButton: {
    marginTop: '25px',
    padding: '10px 20px',
    backgroundColor: '#222',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.2s ease',
  },
};

export default MenuBar;