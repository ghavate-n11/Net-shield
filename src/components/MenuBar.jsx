import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

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

const MenuBar = () => {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [focusedSubIndex, setFocusedSubIndex] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showAbout, setShowAbout] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [capturedPackets, setCapturedPackets] = useState([]); // Array to hold simulated packets
  const [displayFilter, setDisplayFilter] = useState('');
  const [nextPacketId, setNextPacketId] = useState(1); // To assign unique IDs to packets

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

  // Effect for simulating packet capture
  useEffect(() => {
    let interval;
    if (capturing) {
      interval = setInterval(() => {
        setCapturedPackets((prev) => [
          ...prev,
          {
            id: nextPacketId,
            time: new Date().toLocaleTimeString(),
            source: `192.168.1.${Math.floor(Math.random() * 255)}`,
            destination: `10.0.0.${Math.floor(Math.random() * 255)}`,
            protocol: ['TCP', 'UDP', 'ICMP', 'HTTP'][Math.floor(Math.random() * 4)],
            length: Math.floor(Math.random() * 100) + 50,
            info: `Simulated Packet ${nextPacketId}`,
            marked: false,
          },
        ]);
        setNextPacketId((prev) => prev + 1);
      }, 1000); // Capture a new packet every second
    }
    return () => clearInterval(interval);
  }, [capturing, nextPacketId]);

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
          // This will only work if the window was opened by script.
          // For security, browsers often prevent closing windows not opened by script.
          window.close();
        }
        break;
      case 'Edit:Find Packet':
        const packetId = prompt('Enter Packet ID to find:');
        if (packetId) {
          const foundPacket = capturedPackets.find(p => p.id === parseInt(packetId));
          if (foundPacket) {
            alert(`Found Packet: ID ${foundPacket.id}, Protocol: ${foundPacket.protocol}`);
            // In a real app, you'd scroll to and highlight this packet
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
          setCapturedPackets(prev => prev.map(p =>
            p.id === parseInt(markPacketId) ? { ...p, marked: !p.marked } : p
          ));
          alert(`Packet ${markPacketId} marked/unmarked.`);
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
            // In a real app, scroll to and highlight this packet
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
        if (capturing) {
          alert('Capture already started!');
        } else {
          setCapturing(true);
          alert('Capture started (simulated)');
        }
        break;
      case 'Capture:Stop':
        if (!capturing) {
          alert('No capture is running.');
        } else {
          setCapturing(false);
          alert('Capture stopped (simulated)');
        }
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
      `ID: ${p.id}, Time: ${p.time}, Source: ${p.source}, Destination: ${p.destination}, Protocol: ${p.protocol}, Length: ${p.length}, Info: ${p.info}${p.marked ? ' (MARKED)' : ''}`
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

  // Filtered packets based on displayFilter (simple string match for demonstration)
  const filteredPackets = capturedPackets.filter(packet =>
    JSON.stringify(packet).toLowerCase().includes(displayFilter.toLowerCase())
  );

  return (
    <div style={{ fontFamily: 'Segoe UI', backgroundColor: '#f0f0f0', color: '#333', minHeight: '100vh' }}>
      {/* Menu Bar */}
      <div
        ref={menuBarRef}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="menubar"
        aria-label="Application menu"
        style={{
          userSelect: 'none',
          backgroundColor: '#222',
          color: '#eee',
          display: 'flex',
          padding: '5px 10px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          zIndex: 1000,
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
              outline: 'none', // Remove default outline
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
                  border: '1px solid #555',
                  minWidth: '180px',
                  zIndex: 1000,
                  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                  borderRadius: '4px',
                }}
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
                      padding: '8px 15px',
                      backgroundColor: focusedSubIndex === subIdx ? '#666' : 'transparent',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      outline: 'none',
                      transition: 'background-color 0.1s ease',
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

      {/* Main Content Area */}
      <div style={{ padding: '20px', backgroundColor: '#f9f9f9', flexGrow: 1, overflowY: 'auto' }}>
        {/* Packet Capture Status */}
        <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: capturing ? '#d4edda' : '#f8d7da', color: capturing ? '#155724' : '#721c24', borderRadius: '5px' }}>
          {capturing ? 'Packet Capture Running...' : 'Packet Capture Stopped.'}
        </div>

        {/* Display Filter Input */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="display-filter" style={{ marginRight: '10px', fontWeight: 'bold', color: '#555' }}>
            Display Filter:
          </label>
          <input
            id="display-filter"
            type="text"
            value={displayFilter}
            onChange={(e) => setDisplayFilter(e.target.value)}
            placeholder="e.g., tcp.port == 80 or ip.addr == 192.168.1.1"
            style={{
              width: 'calc(100% - 150px)',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
          <button
            onClick={() => alert(`Applying filter: ${displayFilter}`)}
            style={{
              marginLeft: '10px',
              padding: '8px 15px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Apply
          </button>
        </div>

        {/* Captured Packets Display */}
        <div
          style={{
            marginTop: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflowX: 'auto',
            backgroundColor: '#fff',
            fontSize: `${14 * zoomLevel}px`, // Apply zoom level
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#e0e0e0', position: 'sticky', top: 0 }}>
              <tr>
                <th style={tableHeaderStyle}>ID</th>
                <th style={tableHeaderStyle}>Time</th>
                <th style={tableHeaderStyle}>Source</th>
                <th style={tableHeaderStyle}>Destination</th>
                <th style={tableHeaderStyle}>Protocol</th>
                <th style={tableHeaderStyle}>Length</th>
                <th style={tableHeaderStyle}>Info</th>
                <th style={tableHeaderStyle}>Marked</th>
              </tr>
            </thead>
            <tbody>
              {filteredPackets.length > 0 ? (
                filteredPackets.map((packet) => (
                  <tr
                    key={packet.id}
                    style={{
                      borderBottom: '1px solid #eee',
                      backgroundColor: packet.marked ? '#fffacd' : 'transparent', // Light yellow for marked packets
                    }}
                  >
                    <td style={tableCellStyle}>{packet.id}</td>
                    <td style={tableCellStyle}>{packet.time}</td>
                    <td style={tableCellStyle}>{packet.source}</td>
                    <td style={tableCellStyle}>{packet.destination}</td>
                    <td style={tableCellStyle}>{packet.protocol}</td>
                    <td style={tableCellStyle}>{packet.length}</td>
                    <td style={tableCellStyle}>{packet.info}</td>
                    <td style={tableCellStyle}>{packet.marked ? '✅' : '❌'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                    {capturing ? 'Capturing packets...' : 'No packets captured yet. Start a capture!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
          style={{
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
          }}
          onClick={() => setShowAbout(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
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
            }}
          >
            {/* Project Logo */}
            <img
              src="src/assets/Logo.png"
              alt="NetShield Logo"
              style={{ width: '100px', marginBottom: '10px', borderRadius: '8px' }}
            />

            <h2 id="about-title" style={{ color: '#222', marginBottom: '15px' }}>About Net Shield</h2>
            <p style={{ margin: '8px 0' }}><strong>Version:</strong> Net Shield v1.0.0</p>
            <p style={{ margin: '8px 0' }}><strong>Domain:</strong> Cybersecurity / Network Security</p>

            <p style={{ margin: '15px 0', lineHeight: '1.6' }}>
              <strong>Developed By:</strong> Nilesh B. Ghavate (MCA Final Year, SVERI's COE, Pandharpur [PAH Solapur University, Solapur])
            </p>

            <p style={{ margin: '15px 0', lineHeight: '1.6' }}>
              <strong>Project Purpose:</strong> Net Shield is a web-based network packet capturing tool designed to help users monitor and analyze network traffic for troubleshooting and security auditing.
              It is useful for identifying suspicious activity, diagnosing network issues, ensuring compliance with security policies, and gaining insights into network performance.
            </p>
            <p style={{ margin: '15px 0', fontWeight: 'bold' }}>Key Features:</p>
            <ul style={{ textAlign: 'left', margin: '0 auto 20px', maxWidth: '90%', listStyleType: 'disc', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '5px' }}>Capture and display real-time network packets (simulated).</li>
              <li style={{ marginBottom: '5px' }}>Start and stop capturing sessions easily.</li>
              <li style={{ marginBottom: '5px' }}>Save captured data for offline analysis.</li>
              <li style={{ marginBottom: '5px' }}>User-friendly interface with zoom functionality.</li>
              <li>Basic packet filtering capabilities.</li>
            </ul>

            <p style={{ margin: '15px 0', fontWeight: 'bold' }}>Technologies Used:</p>
            <ul style={{ textAlign: 'left', margin: '0 auto 20px', maxWidth: '90%', listStyleType: 'disc', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '5px' }}>React.js for frontend UI development.</li>
              <li style={{ marginBottom: '5px' }}>Spring Boot for backend APIs (planned integration).</li>
              <li style={{ marginBottom: '5px' }}>MySQL for database management (planned integration).</li>
              <li style={{ marginBottom: '5px' }}>Nmap tool for packet capture (planned integration).</li>
              <li>Inspired by Wireshark.</li>
            </ul>

            {/* Developer Photo */}
            <img
              src="src/assets/images/Screenshot 2025-05-10 181434.png"
              alt="Developer"
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                marginBottom: '10px',
                objectFit: 'cover',
                border: '2px solid #222',
              }}
            />

            {/* Name & Role */}
            <div style={{ marginBottom: '15px' }}>
              <h3 style={{ margin: '5px 0', color: '#333' }}>Nilesh Ghavate</h3>
              <p style={{ margin: 0, fontWeight: '500', color: '#555' }}>
                Java Full Stack Developer Intern
              </p>
            </div>

            {/* Social Links */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
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
                  style={{ width: '28px', height: '28px' }}
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
                  style={{ width: '28px', height: '28px' }}
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
                  style={{ width: '28px', height: '28px' }}
                />
              </a>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowAbout(false)}
              style={{
                marginTop: '25px',
                padding: '10px 20px',
                backgroundColor: '#222',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background-color 0.2s ease',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles for the table cells
const tableHeaderStyle = {
  padding: '12px 15px',
  textAlign: 'left',
  borderBottom: '2px solid #ddd',
  fontWeight: 'bold',
  color: '#444',
};

const tableCellStyle = {
  padding: '10px 15px',
  borderBottom: '1px solid #eee',
};

export default MenuBar;