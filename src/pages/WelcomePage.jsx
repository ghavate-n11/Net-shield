import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const INTERFACES = [
  { name: 'Wi-Fi', icon: '📶' },
  { name: 'Loopback', icon: '🖥️' },
  { name: 'Ethernet 1', icon: '🔌' },
  { name: 'Ethernet 2', icon: '🔌' },
  { name: 'Virtual Adapter', icon: '💻' },
];

const VALID_PROTOCOLS = ['tcp', 'udp', 'icmp', 'arp', 'ip'];

const WelcomePage = () => {
  const navigate = useNavigate();

  const [packets, setPackets] = useState([]);
  const [filterInput, setFilterInput] = useState('');
  const [filterError, setFilterError] = useState('');
  const [selectedInterfaces, setSelectedInterfaces] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [recentCaptures, setRecentCaptures] = useState([]);

  const signalStrengths = useMemo(() => {
    const strengths = {};
    INTERFACES.forEach(({ name }) => {
      strengths[name] = Math.floor(Math.random() * 101);
    });
    return strengths;
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('recentCaptures')) || [];
      setRecentCaptures(saved);
    } catch {
      setRecentCaptures([]);
    }
  }, []);

  useEffect(() => {
    const protocols = VALID_PROTOCOLS;
    const generatePacket = () => {
      const protocol = protocols[Math.floor(Math.random() * protocols.length)];
      return {
        timestamp: new Date().toLocaleTimeString(),
        protocol,
        sourceIP: `192.168.0.${Math.floor(Math.random() * 255)}`,
        destinationIP: `10.0.0.${Math.floor(Math.random() * 255)}`,
      };
    };

    const interval = setInterval(() => {
      setPackets((prev) => {
        const newPackets = [generatePacket(), ...prev];
        return newPackets.slice(0, 10);
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const toggleInterface = (iface) => {
    setSelectedInterfaces((prev) =>
      prev.includes(iface)
        ? prev.filter((i) => i !== iface)
        : [...prev, iface]
    );
  };

  const isValidFilter = (filter) => {
    if (!filter) return false;
    const tokens = filter.toLowerCase().split(/\s+/);
    const validTokens = [...VALID_PROTOCOLS, 'port', 'host', 'src', 'dst', 'and', 'or', 'not'];
    return tokens.every((token) => validTokens.includes(token) || /^\d+$/.test(token));
  };

  const handleApplyFilter = () => {
    const filter = filterInput.trim();

    if (!filter) {
      setFilterError('Please enter a filter');
      return;
    }
    if (!isValidFilter(filter)) {
      setFilterError('Please enter a correct protocol name or filter');
      return;
    }
    setFilterError('');
    navigate('/dashboard', { state: { filter, interfaces: selectedInterfaces } });
  };

  const handleStartCapture = () => {
    if (selectedInterfaces.length === 0) {
      alert('Please select at least one interface');
      return;
    }
    if (filterInput && !isValidFilter(filterInput.trim())) {
      alert('Please enter a correct protocol name or filter');
      return;
    }

    const filter = filterInput.trim();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `capture_${filter || 'all'}_${timestamp}.pcap`;

    const newCapture = {
      fileName,
      filter,
      interfaces: selectedInterfaces,
      timestamp: new Date().toLocaleString(),
    };

    const updatedCaptures = [newCapture, ...recentCaptures].slice(0, 5);
    setRecentCaptures(updatedCaptures);
    localStorage.setItem('recentCaptures', JSON.stringify(updatedCaptures));

    navigate('/dashboard', { state: { filter, interfaces: selectedInterfaces, fileName } });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validExtensions = ['pcap', 'pcapng'];
      const ext = file.name.split('.').pop().toLowerCase();
      if (!validExtensions.includes(ext)) {
        alert('Invalid file type. Please select a .pcap or .pcapng file.');
        e.target.value = null;
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file.name);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#121212',
        color: '#e0e0e0',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Net-Shield - Network Traffic Analyzer
      </h1>

      <div
        style={{
          marginBottom: '15px',
          fontWeight: 'bold',
          fontSize: '1.1em',
          animation: 'marquee 10s linear infinite',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          borderBottom: '1px solid #333',
          paddingBottom: '10px',
        }}
      >
        Your secure network shield — monitor live traffic and analyze with ease!
      </div>

      <section
        aria-label="Live Network Traffic Simulation"
        style={{
          backgroundColor: '#222',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '20px',
          maxWidth: '700px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <h2>Live Network Traffic</h2>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.9em',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid #444' }}>
              <th style={{ padding: '8px', textAlign: 'left' }}>Timestamp</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Protocol</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Source IP</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Destination IP</th>
            </tr>
          </thead>
          <tbody>
            {packets.length > 0 ? (
              packets.map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '6px' }}>{p.timestamp}</td>
                  <td style={{ padding: '6px', textTransform: 'uppercase' }}>{p.protocol}</td>
                  <td style={{ padding: '6px' }}>{p.sourceIP}</td>
                  <td style={{ padding: '6px' }}>{p.destinationIP}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '8px', textAlign: 'center' }}>
                  No traffic yet...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section
        aria-label="Filter and Network Interface Selection"
        style={{
          maxWidth: '700px',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '20px',
          marginBottom: '20px',
        }}
      >
        <h2>Filter Packets</h2>
        <input
          type="text"
          placeholder="Enter filter (e.g., tcp, udp, ip, port 80)"
          value={filterInput}
          onChange={(e) => {
            setFilterInput(e.target.value);
            if (filterError) setFilterError('');
          }}
          aria-describedby="filterError"
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: filterError ? '2px solid salmon' : '1px solid #555',
            marginBottom: '6px',
            backgroundColor: '#222',
            color: '#eee',
          }}
        />
        {filterError && (
          <p
            id="filterError"
            role="alert"
            aria-live="assertive"
            style={{ color: 'salmon', marginBottom: '8px' }}
          >
            {filterError}
          </p>
        )}
        <button
          onClick={handleApplyFilter}
          style={{
            backgroundColor: '#4caf50',
            color: '#fff',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '15px',
            width: '100%',
            fontWeight: 'bold',
        }}
         aria-label="Apply filter and navigate to dashboard"
>
Apply Filter
</button>
    <h3>Select Interfaces</h3>
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
        justifyContent: 'center',
      }}
    >
      {INTERFACES.map(({ name, icon }) => {
        const isSelected = selectedInterfaces.includes(name);
        return (
          <button
            key={name}
            onClick={() => toggleInterface(name)}
            aria-pressed={isSelected}
            style={{
              backgroundColor: isSelected ? '#1e88e5' : '#333',
              color: isSelected ? '#fff' : '#ccc',
              border: 'none',
              padding: '10px 14px',
              borderRadius: '5px',
              cursor: 'pointer',
              minWidth: '100px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: '0.9em',
              userSelect: 'none',
            }}
          >
            <span style={{ fontSize: '1.8em' }}>{icon}</span>
            <span>{name}</span>
            <small
              style={{
                marginTop: '4px',
                fontSize: '0.75em',
                color: '#a5d6f9',
              }}
            >
              Signal: {signalStrengths[name]}%
            </small>
          </button>
        );
      })}
    </div>

    <button
      onClick={handleStartCapture}
      style={{
        backgroundColor: '#00796b',
        color: '#fff',
        padding: '12px 18px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        width: '100%',
        fontWeight: 'bold',
        fontSize: '1em',
      }}
      aria-label="Start capturing packets with selected interfaces and filter"
    >
      Start Capture
    </button>
  </section>

  <section
    aria-label="Open a saved capture file"
    style={{
      maxWidth: '700px',
      margin: 'auto',
      marginTop: '30px',
      padding: '15px',
      backgroundColor: '#222',
      borderRadius: '8px',
    }}
  >
    <h2>Open Saved Capture File</h2>
    <input
      type="file"
      accept=".pcap,.pcapng"
      onChange={handleFileChange}
      aria-label="Select a capture file to open"
      style={{
        color: '#eee',
        backgroundColor: '#333',
        padding: '6px 10px',
        borderRadius: '5px',
        border: '1px solid #555',
        width: '100%',
      }}
    />
    {selectedFile && (
      <p
        style={{
          marginTop: '10px',
          color: '#a5d6f9',
          fontWeight: 'bold',
          wordBreak: 'break-word',
        }}
      >
        Selected file: {selectedFile}
      </p>
    )}
  </section>

  <section
    aria-label="Recent Capture Files"
    style={{
      maxWidth: '700px',
      margin: '30px auto 40px',
      color: '#aaa',
    }}
  >
    <h2>Recent Capture Files</h2>
    {recentCaptures.length === 0 ? (
      <p>No recent capture files available.</p>
    ) : (
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}
      >
        {recentCaptures.map(({ fileName, timestamp }, i) => (
          <li
            key={i}
            style={{
              backgroundColor: '#333',
              marginBottom: '8px',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'default',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>{fileName}</span>
            <span style={{ fontSize: '0.8em', color: '#888' }}>{timestamp}</span>
          </li>
        ))}
      </ul>
    )}
  </section>
</div>
);
};

export default WelcomePage;
