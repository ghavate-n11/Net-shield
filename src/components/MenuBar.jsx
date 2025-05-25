import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Linkedin } from 'lucide-react';

const menuStructure = [
  { label: 'File', submenu: ['Open', 'Save', 'Print'] },
  { label: 'Edit', submenu: ['Find Packet', 'Set Time Reference', 'Mark Packet', 'Preferences'] },
  { label: 'View', submenu: ['Zoom In', 'Zoom Out', 'Packet Details'] },
  { label: 'Go', submenu: ['Go to Packet'] },
  { label: 'Capture', submenu: ['Start', 'Stop'] },
  { label: 'Analyze', submenu: ['Display Filters', 'Enable Protocol'] },
  { label: 'Statistics', submenu: ['Summary', 'Protocol Hierarchy', 'Conversations', 'Endpoints'] },
  { label: 'Telephony', submenu: ['VoIP Calls', 'SIP Flows', 'RTP Streams'] },
  { label: 'Wireless', submenu: ['Bluetooth Stats', '802.11 Stats'] },
  { label: 'Tools', submenu: ['Firewall ACL Rules'] },
  {
    label: 'Help',
    submenu: ["User's Guide", 'GitHub', 'FAQs', 'About'],
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
  const [capturedData, setCapturedData] = useState('');

  const fileInputRef = useRef(null);
  const menuBarRef = useRef(null);

  // Use navigate hook here
  const navigate = useNavigate();

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

  useEffect(() => {
    let interval;
    if (capturing) {
      interval = setInterval(() => {
        setCapturedData((prev) => prev + `Packet captured at ${new Date().toLocaleTimeString()}\n`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [capturing]);

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
      case 'File:Save':
        if (!capturedData) {
          alert('No captured data to save!');
          return;
        }
        saveCapturedData();
        break;
      case 'File:Print':
        window.print();
        break;
      case 'File:Quit':
        window.close();
        break;
      case 'View:Zoom In':
        setZoomLevel((z) => Math.min(z + 0.1, 2));
        break;
      case 'View:Zoom Out':
        setZoomLevel((z) => Math.max(z - 0.1, 0.5));
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
         case 'Wireless:Bluetooth Stats':
      navigate('/bluetooth-stats');
      break;

    case 'Wireless:802.11 Stats':
      navigate('/wireless-80211-stats');
      break;
      case 'Tools:Firewall ACL Rules':
        navigate('/firewall-Rules'); // navigation using react-router-dom
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
    const blob = new Blob([capturedData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NetShield_Capture_${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
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
                  border: '1px solid #555',
minWidth: '180px',
zIndex: 1000,
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
padding: '5px 15px',
backgroundColor: focusedSubIndex === subIdx ? '#666' : 'transparent',
cursor: 'pointer',
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
{/* Hidden File Input for Open */}
  <input
    type="file"
    ref={fileInputRef}
    style={{ display: 'none' }}
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        alert(`Selected file: ${file.name}`);
      }
      e.target.value = '';
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
    }}
    onClick={() => setShowAbout(false)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        backgroundColor: '#fff',
        color: '#000',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '400px',
        textAlign: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
      }}
    >
      {/* Project Logo */}
      <img
        src="src/assets/Logo.png" // Replace with your image path
        alt="NetShield Logo"
        style={{ width: '120px', marginBottom: '15px', borderRadius: '8px' }}
      />

      <h2 id="about-title">About NetShield</h2>
      <p><strong>Version:</strong> 1.0.0</p>
      <p><strong>Developed By:</strong> Nilesh Ghavate (MCA Student)</p>
      <p><strong>College Name:</strong> SVERI's College of Engineering, Pandharpur</p>
      <p><strong>Department:</strong> MCA Second Year</p>
      <p><strong>University:</strong> Punyashlok Ahilyadevi Holkar Solapur University, Solapur</p>

      <p><strong>Project Purpose:</strong> Net Shield is a web-based network packet capturing tool designed to help users monitor and analyze network traffic for troubleshooting and security auditing.</p>

      <p><strong>Key Features:</strong></p>
      <ul style={{ paddingLeft: '20px' }}>
        <li>Capture and display real-time network packets.</li>
        <li>Start and stop capturing sessions easily.</li>
        <li>Save captured data for offline analysis.</li>
        <li>User-friendly interface with zoom functionality.</li>
      </ul>

      <p><strong>Technologies Used:</strong></p>
      <ul style={{ paddingLeft: '20px' }}>
        <li>React.js for frontend UI development.</li>
        <li>Spring Boot (Java framework) for backend APIs and logic.</li>
        <li>MySQL for data storage and management.</li>
        <li>Nmap tool for capturing live network packets.</li>
        <li>Inspired by Wireshark tool.</li>
      </ul>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
        <a
          href="https://github.com/ghavate-n11"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Profile"
        >
          <Github />
        </a>
        <a
          href="https://www.linkedin.com/in/nileshghavate-203b27251/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn Profile"
        >
          <Linkedin />
        </a>
      </div>

      <button
        onClick={() => setShowAbout(false)}
        style={{
          marginTop: '20px',
          padding: '8px 16px',
          backgroundColor: '#222',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
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

export default MenuBar;
