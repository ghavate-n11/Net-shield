import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// Ribbon component: filter input + start/stop/reload buttons
const Ribbon = ({ filter, onFilterChange, onStart, onStop, onReload, isCapturing }) => (
  <div
    style={{
      backgroundColor: '#072146',
      padding: '0.75rem 1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      color: '#a3d9ff',
      boxShadow: '0 0 5px #00aaff',
      fontFamily: 'Arial, sans-serif',
    }}
  >
    <label htmlFor="filter" style={{ fontWeight: 'bold' }}>
      Filter:
    </label>
    <input
      id="filter"
      type="text"
      placeholder="Filter by source, destination, protocol..."
      value={filter}
      onChange={(e) => onFilterChange(e.target.value)}
      style={{
        flexGrow: 1,
        padding: '0.4rem 0.6rem',
        borderRadius: '3px',
        border: '1px solid #4fc3f7',
        fontSize: '1rem',
        color: '#072146',
      }}
      aria-label="Filter packets by source, destination, or protocol"
    />
    <button
      onClick={onStart}
      disabled={isCapturing}
      style={{
        backgroundColor: isCapturing ? '#4fc3f7' : '#00aaff',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '3px',
        color: '#072146',
        cursor: isCapturing ? 'not-allowed' : 'pointer',
        fontWeight: 'bold',
      }}
      title="Start capturing packets"
    >
      Start
    </button>
    <button
      onClick={onStop}
      disabled={!isCapturing}
      style={{
        backgroundColor: !isCapturing ? '#4fc3f7' : '#00aaff',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '3px',
        color: '#072146',
        cursor: !isCapturing ? 'not-allowed' : 'pointer',
        fontWeight: 'bold',
      }}
      title="Stop capturing packets"
    >
      Stop
    </button>
    <button
      onClick={onReload}
      style={{
        backgroundColor: '#00aaff',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '3px',
        color: '#072146',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}
      title="Clear and reload packets"
    >
      Reload
    </button>
  </div>
);

// NetworkTable component: list packets with columns
const NetworkTable = ({ packets, onSelect }) => {
  // keyboard accessibility for selecting packet rows
  const handleKeyDown = (e, pkt) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(pkt);
    }
  };

  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.9rem',
        color: '#a3d9ff',
        fontFamily: 'Consolas, monospace',
      }}
      aria-label="Network packets table"
    >
      <thead style={{ backgroundColor: '#0d2a66' }}>
        <tr>
          <th style={{ padding: '0.5rem', borderBottom: '1px solid #4fc3f7' }}>#</th>
          <th style={{ padding: '0.5rem', borderBottom: '1px solid #4fc3f7' }}>Source</th>
          <th style={{ padding: '0.5rem', borderBottom: '1px solid #4fc3f7' }}>Destination</th>
          <th style={{ padding: '0.5rem', borderBottom: '1px solid #4fc3f7' }}>Protocol</th>
          <th style={{ padding: '0.5rem', borderBottom: '1px solid #4fc3f7' }}>Length</th>
          <th style={{ padding: '0.5rem', borderBottom: '1px solid #4fc3f7' }}>Info</th>
        </tr>
      </thead>
      <tbody>
        {packets.length === 0 && (
          <tr>
            <td colSpan="6" style={{ padding: '1rem', textAlign: 'center', color: '#a3d9ff88' }}>
              No packets to display
            </td>
          </tr>
        )}
        {packets.map((pkt, idx) => (
          <tr
            key={pkt.id}
            tabIndex={0}
            onClick={() => onSelect(pkt)}
            onKeyDown={(e) => handleKeyDown(e, pkt)}
            style={{
              cursor: 'pointer',
              backgroundColor: idx % 2 === 0 ? '#092254' : '#0b2748',
              outline: 'none',
            }}
            aria-label={`Packet ${idx + 1} from ${pkt.source} to ${pkt.destination} protocol ${pkt.protocol}`}
          >
            <td style={{ padding: '0.3rem 0.5rem', borderBottom: '1px solid #4fc3f7' }}>{idx + 1}</td>
            <td style={{ padding: '0.3rem 0.5rem', borderBottom: '1px solid #4fc3f7' }}>{pkt.source}</td>
            <td style={{ padding: '0.3rem 0.5rem', borderBottom: '1px solid #4fc3f7' }}>{pkt.destination}</td>
            <td style={{ padding: '0.3rem 0.5rem', borderBottom: '1px solid #4fc3f7' }}>{pkt.protocol}</td>
            <td style={{ padding: '0.3rem 0.5rem', borderBottom: '1px solid #4fc3f7' }}>{pkt.length}</td>
            <td style={{ padding: '0.3rem 0.5rem', borderBottom: '1px solid #4fc3f7' }}>{pkt.info}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// PacketDetails component: shows all packet details as a list
const PacketDetails = ({ packet }) => {
  if (!packet)
    return (
      <div
        style={{
          backgroundColor: '#072146',
          borderRadius: '6px',
          padding: '0.75rem',
          color: '#a3d9ff99',
          fontFamily: 'Consolas, monospace',
          flexGrow: 1,
          overflowY: 'auto',
          minHeight: '10rem',
        }}
        aria-live="polite"
      >
        Select a packet to see details
      </div>
    );

  return (
    <div
      style={{
        backgroundColor: '#072146',
        borderRadius: '6px',
        padding: '0.75rem',
        color: '#a3d9ff',
        fontFamily: 'Consolas, monospace',
        flexGrow: 1,
        overflowY: 'auto',
        minHeight: '10rem',
      }}
      aria-live="polite"
    >
      <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontWeight: 'bold' }}>
        Packet Details (ID: {packet.id})
      </h3>
      <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0 }}>
        {Object.entries(packet).map(([key, value]) => (
          <li key={key} style={{ marginBottom: '0.3rem' }}>
            <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
          </li>
        ))}
      </ul>
    </div>
  );
};

// PacketDiagram component: simple visual representation of packet flow
const PacketDiagram = ({ packet }) => {
  if (!packet)
    return (
      <div
        style={{
          backgroundColor: '#072146',
          borderRadius: '6px',
          padding: '0.75rem',
          color: '#a3d9ff99',
          fontFamily: 'Arial, sans-serif',
          textAlign: 'center',
          flexGrow: 0,
          minHeight: '8rem',
        }}
        aria-live="polite"
      >
        Select a packet to see diagram
      </div>
    );

  return (
    <div
      style={{
        backgroundColor: '#072146',
        borderRadius: '6px',
        padding: '0.75rem',
        color: '#a3d9ff',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        flexGrow: 0,
        minHeight: '8rem',
      }}
      aria-live="polite"
      aria-label="Packet flow diagram"
    >
      <h4 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Packet Flow Diagram</h4>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          fontWeight: 'bold',
          fontSize: '1.1rem',
        }}
      >
        <div
          style={{
            backgroundColor: '#0a3e81',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            boxShadow: '0 0 5px #4fc3f7',
            userSelect: 'none',
          }}
          title={`Source: ${packet.source}`}
        >
          {packet.source}
        </div>
        <div
          style={{
            fontSize: '2rem',
            color: '#4fc3f7',
            userSelect: 'none',
            margin: '0 1rem',
          }}
          aria-hidden="true"
        >
          →
        </div>
        <div
          style={{
            backgroundColor: '#0a3e81',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            boxShadow: '0 0 5px #4fc3f7',
            userSelect: 'none',
          }}
          title={`Destination: ${packet.destination}`}
        >
          {packet.destination}
        </div>
      </div>
      <div style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
        <strong>Protocol:</strong> {packet.protocol} &nbsp; | &nbsp;
        <strong>Length:</strong> {packet.length}
      </div>
    </div>
  );
};


// SummaryPanel component: show total captured packets and breakdown by protocol
const SummaryPanel = ({ packets }) => {
  const total = packets.length;
  const protocolCount = packets.reduce((acc, pkt) => {
    acc[pkt.protocol] = (acc[pkt.protocol] || 0) + 1;
    return acc;
  }, {});

  return (
    <div
      style={{
        backgroundColor: '#072146',
        borderRadius: '6px',
        padding: '0.75rem',
        color: '#a3d9ff',
        fontFamily: 'Arial, sans-serif',
        flexGrow: 0,
      }}
      aria-live="polite"
      aria-label="Summary of captured packets"
    >
      <h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Summary</h4>
      <p>Total Packets Captured: <strong>{total}</strong></p>
      <div>
        {Object.entries(protocolCount).map(([proto, count]) => (
          <div key={proto}>
            {proto}: {count}
          </div>
        ))}
        {total === 0 && <div>No packets captured yet</div>}
      </div>
    </div>
  );
};

// Debounce hook for performance on filter input
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Main Dashboard component
const Dashboard = () => {
  const [packets, setPackets] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedPacket, setSelectedPacket] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const packetIndexRef = useRef(0);

  // Example packet data to simulate capturing
 const allPackets = [
  {
    id: 'pkt1',
    source: '192.168.0.2',
    destination: '192.168.0.10',
    protocol: 'TCP',
    length: 60,
    info: 'TCP 192.168.0.2:12345 → 192.168.0.10:80 [SYN] Seq=0 Win=64240 Len=0 MSS=1460',
    details: {
      ethernet: '...',
      ip: '...',
      tcp: 'SYN',
    },
  },
  {
    id: 'pkt2',
    source: '192.168.0.10',
    destination: '192.168.0.2',
    protocol: 'TCP',
    length: 60,
    info: 'TCP 192.168.0.10:80 → 192.168.0.2:12345 [SYN, ACK] Seq=0 Ack=1 Win=64240 Len=0 MSS=1460',
    details: {
      ethernet: '...',
      ip: '...',
      tcp: 'SYN-ACK',
    },
  },
  {
    id: 'pkt3',
    source: '192.168.0.2',
    destination: '192.168.0.10',
    protocol: 'TCP',
    length: 54,
    info: 'TCP 192.168.0.2:12345 → 192.168.0.10:80 [ACK] Seq=1 Ack=1 Win=64240 Len=0',
    details: {
      ethernet: '...',
      ip: '...',
      tcp: 'ACK',
    },
  },
  {
    id: 'pkt4',
    source: '192.168.0.2',
    destination: '192.168.0.10',
    protocol: 'HTTP',
    length: 150,
    info: 'GET /index.html HTTP/1.1',
    details: {
      ethernet: '...',
      ip: '...',
      tcp: '...',
      http: 'GET /index.html HTTP/1.1',
    },
  },
  {
    id: 'pkt5',
    source: '192.168.0.10',
    destination: '192.168.0.2',
    protocol: 'HTTP',
    length: 500,
    info: 'HTTP/1.1 200 OK (text/html)',
    details: {
      ethernet: '...',
      ip: '...',
      tcp: '...',
      http: 'HTTP/1.1 200 OK',
    },
  },
  {
    id: 'pkt6',
    source: '192.168.0.2',
    destination: '8.8.8.8',
    protocol: 'ICMP',
    length: 74,
    info: 'Echo (ping) request id=0x1, seq=1, ttl=64',
    details: {
      ethernet: '...',
      ip: '...',
      icmp: 'Echo request',
    },
  },
  {
    id: 'pkt7',
    source: '8.8.8.8',
    destination: '192.168.0.2',
    protocol: 'ICMP',
    length: 74,
    info: 'Echo (ping) reply id=0x1, seq=1, ttl=128',
    details: {
      ethernet: '...',
      ip: '...',
      icmp: 'Echo reply',
    },
  },
];

  // Debounce filter for performance
  const debouncedFilter = useDebounce(filter, 300);

  // Filter packets based on source, destination, or protocol matching filter
  const filteredPackets = packets.filter(
    (pkt) =>
      pkt.source.toLowerCase().includes(debouncedFilter.toLowerCase()) ||
      pkt.destination.toLowerCase().includes(debouncedFilter.toLowerCase()) ||
      pkt.protocol.toLowerCase().includes(debouncedFilter.toLowerCase())
  );

  // Simulate packet capture every 2 seconds
  useEffect(() => {
    if (!isCapturing) return;

    const interval = setInterval(() => {
      if (packetIndexRef.current >= allPackets.length) {
        setIsCapturing(false);
        return;
      }
      setPackets((prev) => [...prev, allPackets[packetIndexRef.current++]]);
    }, 1500);

    return () => clearInterval(interval);
  }, [isCapturing]);

  // Stop capturing when packets exhausted
  useEffect(() => {
    if (packetIndexRef.current >= allPackets.length) {
      setIsCapturing(false);
    }
  }, [packets]);

  const handleStart = () => {
    if (packets.length >= allPackets.length) {
      alert('All packets have been captured. Please reload.');
      return;
    }
    setIsCapturing(true);
  };

  const handleStop = () => setIsCapturing(false);

  const handleReload = () => {
    setPackets([]);
    packetIndexRef.current = 0;
    setSelectedPacket(null);
    setIsCapturing(false);
  };

  const handleSelect = (pkt) => setSelectedPacket(pkt);

  return (
    <>
      <Ribbon
        filter={filter}
        onFilterChange={setFilter}
        onStart={handleStart}
        onStop={handleStop}
        onReload={handleReload}
        isCapturing={isCapturing}
      />
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          padding: '1rem',
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#0b1a38',
          minHeight: 'calc(100vh - 65px)',
        }}
      >
        <div
          style={{
            flex: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            borderRight: '2px solid #4fc3f7',
            paddingRight: '1rem',
          }}
        >
          <NetworkTable packets={filteredPackets} onSelect={handleSelect} />
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            paddingLeft: '1rem',
          }}
        >
          <PacketDetails packet={selectedPacket} />
          <PacketDiagram packet={selectedPacket} />
          <SummaryPanel packets={packets} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;  
