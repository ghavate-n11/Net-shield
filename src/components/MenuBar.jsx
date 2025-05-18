import React, { useState, useEffect, useRef } from 'react';

const menuStructure = [
  { label: 'File', submenu: ['Open', 'Save', 'Export', 'Quit'] },
  { label: 'Capture', submenu: ['Start', 'Stop'] },
  { label: 'View', submenu: ['Zoom In', 'Zoom Out'] },
  { label: 'Help', submenu: ['About'] },
];

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
    if (openMenuIndex === null) return;
    const submenuLength = menuStructure[openMenuIndex].submenu.length;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedSubIndex((prev) => (prev === null || prev === submenuLength - 1 ? 0 : prev + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedSubIndex((prev) => (prev === null || prev === 0 ? submenuLength - 1 : prev - 1));
        break;
      case 'Escape':
        e.preventDefault();
        setOpenMenuIndex(null);
        setFocusedSubIndex(null);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedSubIndex !== null) {
          handleMenuAction(openMenuIndex, focusedSubIndex);
        }
        break;
      default:
        break;
    }
  };

  const handleMenuClick = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
    setFocusedSubIndex(null);
  };

  const handleMouseEnterMenu = (index) => {
    if (openMenuIndex !== null) {
      setOpenMenuIndex(index);
      setFocusedSubIndex(null);
    }
  };

  const handleMenuAction = (menuIndex, subIndex) => {
    const menu = menuStructure[menuIndex];
    const action = menu.submenu[subIndex];

    setOpenMenuIndex(null);
    setFocusedSubIndex(null);

    switch (`${menu.label}:${action}`) {
      case 'File:Open':
        fileInputRef.current.click(); // trigger file dialog
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
                }}
              >
                {menu.submenu.map((item, subIdx) => (
                  <li
                    key={item}
                    tabIndex={focusedSubIndex === subIdx ? 0 : -1}
                    onClick={() => handleMenuAction(idx, subIdx)}
                    onMouseEnter={() => setFocusedSubIndex(subIdx)}
                    style={{
                      padding: '6px 15px',
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

      {/* Content Area */}
      <div style={{ fontSize: `${zoomLevel}em`, padding: 20 }}>
        <h2>Packet List (simulated)</h2>
        <p>Status: {capturing ? 'Capturing...' : 'Idle'}</p>
      </div>

      {/* File Picker (hidden) */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => alert(`File selected: ${e.target.files[0]?.name}`)}
      />

      {/* About Modal */}
      {showAbout && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            backgroundColor: '#fff', padding: 20, borderRadius: 8, minWidth: 300
          }}>
            <h3>About</h3>
            <p>This is a simulated Wireshark-style React UI.</p>
            <button onClick={() => setShowAbout(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuBar;
