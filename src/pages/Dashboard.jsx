import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Still keeping axios, though not used in simulation yet.

// Helper function to format timestamp difference
const formatTimeDelta = (ms) => {
  if (ms === null || isNaN(ms)) return '';
  if (ms < 1000) return `${ms.toFixed(3)} ms`;
  return `${(ms / 1000).toFixed(3)} s`;
};

// Recursive component to render nested packet details
const DetailItem = ({ label, value }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  if (typeof value === 'object' && value !== null) {
    const isArray = Array.isArray(value);
    const entries = Object.entries(value);

    // Don't show toggle for empty objects/arrays
    if (entries.length === 0) {
      return (
        <li style={{ marginBottom: '0.3rem' }}>
          <strong>{label}:</strong> {isArray ? '[]' : '{}'}
        </li>
      );
    }

    return (
      <li style={{ marginBottom: '0.3rem' }}>
        <span
          onClick={toggleOpen}
          style={{ cursor: 'pointer', userSelect: 'none', color: '#88ddff', fontWeight: 'bold' }}
          aria-expanded={isOpen}
          aria-controls={`details-list-${label}`}
        >
          {isOpen ? '▼' : '▶'} {label} ({isArray ? 'array' : 'object'})
        </span>
        {isOpen && (
          <ul
            id={`details-list-${label}`}
            style={{ listStyleType: 'none', paddingLeft: '1rem', margin: 0 }}
          >
            {entries.map(([key, val], idx) => (
              <DetailItem key={`${label}-${key}-${idx}`} label={key} value={val} />
            ))}
          </ul>
        )}
      </li>
    );
  }

  // Handle boolean values
  if (typeof value === 'boolean') {
    value = value.toString();
  }

  return (
    <li style={{ marginBottom: '0.3rem', wordBreak: 'break-word' }}>
      <strong>{label}:</strong>{' '}
      <span style={{ fontSize: '0.85rem', color: '#a3d9ff' }}>
        {value === '' ? 'N/A' : value}
      </span>
    </li>
  );
};

// Ribbon component: filter input + start/stop/reload/search buttons
const Ribbon = ({ filter, onFilterChange, onStart, onStop, onReload, isCapturing, searchTerm, onSearchTermChange }) => (
  <div
    style={{
      backgroundColor: '#072146',
      padding: '0.75rem 1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      color: '#a3d9ff',
      boxShadow: '0 0 5px rgb(184, 112, 19)',
      fontFamily: 'Arial, sans-serif',
    }}
  >
    <label htmlFor="filter" style={{ fontWeight: 'bold', minWidth: '40px' }}>
      Filter:
    </label>
    <input
      id="filter"
      type="text"
      placeholder="Filter by source, dest, protocol, info..."
      value={filter}
      onChange={(e) => onFilterChange(e.target.value)}
      style={{
        flexGrow: 1,
        padding: '0.4rem 0.6rem',
        borderRadius: '3px',
        border: '1px solid #4fc3f7',
        fontSize: '1rem',
        color: '#072146',
        backgroundColor: '#e0f2f7',
      }}
      aria-label="Filter packets by source, destination, protocol, or info"
    />
    <label htmlFor="search" style={{ fontWeight: 'bold', minWidth: '40px' }}>
      Search:
    </label>
    <input
      id="search"
      type="text"
      placeholder="Search all packet content..."
      value={searchTerm}
      onChange={(e) => onSearchTermChange(e.target.value)}
      style={{
        flexGrow: 1,
        padding: '0.4rem 0.6rem',
        borderRadius: '3px',
        border: '1px solid #4fc3f7',
        fontSize: '1rem',
        color: '#072146',
        backgroundColor: '#e0f2f7',
      }}
      aria-label="Search all packet content including details"
    />
    <button
      onClick={onStart}
      disabled={isCapturing}
      style={{
        backgroundColor: isCapturing ? '#044c7a' : '#00aaff',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '3px',
        color: '#e0f2f7',
        cursor: isCapturing ? 'not-allowed' : 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
      }}
      title="Start capturing packets"
    >
      Start
    </button>
    <button
      onClick={onStop}
      disabled={!isCapturing}
      style={{
        backgroundColor: !isCapturing ? '#044c7a' : '#00aaff',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '3px',
        color: '#e0f2f7',
        cursor: !isCapturing ? 'not-allowed' : 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
      }}
      title="Stop capturing packets"
    >
      Stop
    </button>
    <button
      onClick={onReload}
      style={{
        backgroundColor: '#ff5722', // A more distinct color for Reload
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '3px',
        color: '#e0f2f7',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
      }}
      title="Clear and reload packets"
    >
      Reload
    </button>
  </div>
);

// Packet coloring rules
const getPacketRowStyle = (packet, idx, selectedPacketId) => {
  const isSelected = packet.id === selectedPacketId;
  let backgroundColor = idx % 2 === 0 ? '#092254' : '#0b2748'; // Default alternating rows

  // Apply protocol-based coloring
  switch (packet.protocol) {
    case 'DNS':
      backgroundColor = '#4CAF5022'; // Greenish
      break;
    case 'TCP':
      backgroundColor = '#2196F322'; // Blueish
      break;
    case 'HTTP':
      backgroundColor = '#FFC10722'; // Orange-yellowish
      break;
    case 'ICMP':
      backgroundColor = '#9C27B022'; // Purplish
      break;
    case 'ARP':
      backgroundColor = '#00BCD422'; // Cyan-ish
      break;
    default:
      break;
  }

  // Apply status-based coloring (overrides protocol if applicable)
  switch (packet.status) {
    case 'error':
      backgroundColor = '#F4433644'; // Red for errors
      break;
    case 'warning':
      backgroundColor = '#FF980044'; // Amber for warnings
      break;
    default:
      break;
  }

  // Selected row style
  if (isSelected) {
    backgroundColor = '#4fc3f744'; // Brighter blue for selected
    return {
      cursor: 'pointer',
      backgroundColor,
      outline: '1px solid #4fc3f7', // Add a border for clear selection
    };
  }

  return {
    cursor: 'pointer',
    backgroundColor,
    outline: 'none',
    borderLeft: '2px solid transparent', // Keep alignment
    borderRight: '2px solid transparent', // Keep alignment
  };
};

// NetworkTable component: list packets with columns
const NetworkTable = ({ packets, onSelect, selectedPacket, onFollowConversation }) => {
  const tableRef = useRef(null); // Ref for the table body to scroll to new packets

  // Scroll to the latest packet if capturing
  useEffect(() => {
    if (tableRef.current && packets.length > 0) {
      tableRef.current.scrollTop = tableRef.current.scrollHeight;
    }
  }, [packets]);

  // keyboard accessibility for selecting packet rows
  const handleKeyDown = (e, pkt) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(pkt);
    }
  };

  return (
    <div style={{ flexGrow: 1, overflowY: 'auto', border: '1px solid #4fc3f766', borderRadius: '4px' }}>
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
        <thead style={{ backgroundColor: '#0d2a66', position: 'sticky', top: 0, zIndex: 1 }}>
          <tr>
            <th style={{ padding: '0.5rem', borderBottom: '1px solid #4fc3f7' }}>#</th>
            <th style={{ padding: '0.5rem', borderBottom: '1px solid #4fc3f7' }}>Time Delta</th>
            <th style={{ padding: '0.5rem', borderBottom: '1px solid #4fc3f7' }}>Timestamp</th>
            <th style={{ padding: '0.5rem', borderBottom: '1px solid #4fc3f7' }}>Source</th>
            <th style={{ padding: '0.5rem', borderBottom: '1px solid #4fc3f7' }}>Destination</th>
            <th style={{ padding: '0.5rem', borderBottom: '1px solid #4fc3f7' }}>Protocol</th>
            <th style={{ padding: '0.5rem', borderBottom: '1px solid #4fc3f7' }}>Length</th>
            <th style={{ padding: '0.5rem', borderBottom: '1px solid #4fc3f7' }}>Info</th>
          </tr>
        </thead>
        <tbody ref={tableRef}>
          {packets.length === 0 && (
            <tr>
              <td colSpan="8" style={{ padding: '1rem', textAlign: 'center', color: '#a3d9ff88' }}>
                No packets to display
              </td>
            </tr>
          )}
          {packets.map((pkt, idx) => {
            const prevPkt = packets[idx - 1];
            const timeDeltaMs = prevPkt
              ? new Date(pkt.timestamp).getTime() - new Date(prevPkt.timestamp).getTime()
              : null;
            const timeDelta = formatTimeDelta(timeDeltaMs);

            return (
              <tr
                key={pkt.id}
                tabIndex={0}
                onClick={() => onSelect(pkt)}
                onKeyDown={(e) => handleKeyDown(e, pkt)}
                style={getPacketRowStyle(pkt, idx, selectedPacket?.id)}
                aria-label={`Packet ${idx + 1} from ${pkt.source} to ${pkt.destination} protocol ${pkt.protocol}`}
              >
                <td style={{ padding: '0.3rem 0.5rem', borderBottom: '1px solid #4fc3f744' }}>{idx + 1}</td>
                <td style={{ padding: '0.3rem 0.5rem', borderBottom: '1px solid #4fc3f744', color: '#ffe082' }}>{timeDelta}</td>
                <td style={{ padding: '0.3rem 0.5rem', borderBottom: '1px solid #4fc3f744' }}>{pkt.timestamp}</td>
                <td style={{ padding: '0.3rem 0.5rem', borderBottom: '1px solid #4fc3f744' }}>{pkt.source}</td>
                <td style={{ padding: '0.3rem 0.5rem', borderBottom: '1px solid #4fc3f744' }}>{pkt.destination}</td>
                <td style={{ padding: '0.3rem 0.5rem', borderBottom: '1px solid #4fc3f744' }}>{pkt.protocol}</td>
                <td style={{ padding: '0.3rem 0.5rem', borderBottom: '1px solid #4fc3f744' }}>{pkt.length}</td>
                <td style={{ padding: '0.3rem 0.5rem', borderBottom: '1px solid #4fc3f744' }}>{pkt.info}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// PacketDetails component: shows all packet details as a list (now tree-like)
const PacketDetails = ({ packet, onFollowConversation }) => {
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
        border: '1px solid #4fc3f766',
      }}
      aria-live="polite"
    >
      <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Packet Details (ID: {packet.id})
        <button
          onClick={() => onFollowConversation(packet)}
          style={{
            backgroundColor: '#17a2b8', // Info blue
            border: 'none',
            padding: '0.3rem 0.7rem',
            borderRadius: '3px',
            color: '#e0f2f7',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.8rem',
          }}
          title="Filter table to show this conversation"
        >
          Follow Conversation
        </button>
      </h3>
      <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0 }}>
        {Object.entries(packet).map(([key, value]) => {
          // Skip 'id' as it's displayed in the header
          if (key === 'id') return null;
          return <DetailItem key={key} label={key} value={value} />;
        })}
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #4fc3f766',
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
        border: '1px solid #4fc3f766',
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '50px', // Ensure arrow has space
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
        <strong>Length:</strong> {packet.length} &nbsp; | &nbsp;
        <strong>Timestamp:</strong> {packet.timestamp}
      </div>
    </div>
  );
};

// SummaryPanel component: show total captured packets and breakdown by protocol
const SummaryPanel = ({ packets }) => {
  const total = packets.length;
  const totalLength = packets.reduce((sum, pkt) => sum + pkt.length, 0);

  const protocolCount = packets.reduce((acc, pkt) => {
    acc[pkt.protocol] = (acc[pkt.protocol] || 0) + 1;
    return acc;
  }, {});

  const sortedProtocols = Object.entries(protocolCount).sort(([, countA], [, countB]) => countB - countA);

  return (
    <div
      style={{
        backgroundColor: '#072146',
        borderRadius: '6px',
        padding: '0.75rem',
        color: '#a3d9ff',
        fontFamily: 'Arial, sans-serif',
        flexGrow: 0,
        border: '1px solid #4fc3f766',
      }}
      aria-live="polite"
      aria-label="Summary of captured packets"
    >
      <h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Summary</h4>
      <p style={{ margin: '0.3rem 0' }}>Total Packets Captured: <strong>{total}</strong></p>
      <p style={{ margin: '0.3rem 0' }}>Total Bytes: <strong>{totalLength}</strong></p>
      <h5 style={{ margin: '0.7rem 0 0.4rem 0' }}>Protocol Distribution:</h5>
      <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
        {sortedProtocols.length === 0 ? (
          <div>No protocols observed yet</div>
        ) : (
          <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0 }}>
            {sortedProtocols.map(([proto, count]) => (
              <li key={proto} style={{ marginBottom: '0.2rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>{proto}:</span> <span>{count} ({((count / total) * 100).toFixed(1)}%)</span>
              </li>
            ))}
          </ul>
        )}
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPacket, setSelectedPacket] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [conversationFilter, setConversationFilter] = useState(null); // { source, destination }
  const packetIndexRef = useRef(0);

  // Example packet data to simulate capturing with added timestamps and richer details
  // Note: In a real app, 'details' would be dynamically parsed.
  const allPackets = [
    {
      id: 'pkt1',
      timestamp: '2025-06-01 10:00:01.123',
      source: '192.168.1.100',
      destination: '192.168.1.1',
      protocol: 'DNS',
      length: 80,
      info: 'Standard query 0x1234 A google.com',
      status: 'good',
      details: {
        Frame: { number: 1, length: 80, timestamp: '2025-06-01 10:00:01.123' },
        Ethernet: { src_mac: '00:11:22:33:44:55', dst_mac: 'AA:BB:CC:DD:EE:FF', type: 'IPv4 (0x0800)' },
        IPv4: { version: 4, header_length: 20, src_ip: '192.168.1.100', dst_ip: '192.168.1.1', protocol: 'UDP (17)', ttl: 64 },
        UDP: { src_port: 53456, dst_port: 53, length: 60, checksum: '0xABCD (correct)' },
        DNS: {
          transaction_id: '0x1234',
          flags: { query: true, recursion_desired: true, z: false, ra: false },
          questions: [{ name: 'google.com', type: 'A (Host Address)', class: 'IN (0x0001)' }],
        },
      },
    },
    {
      id: 'pkt2',
      timestamp: '2025-06-01 10:00:01.250',
      source: '192.168.1.1',
      destination: '192.168.1.100',
      protocol: 'DNS',
      length: 120,
      info: 'Standard query response 0x1234 A 93.184.216.34',
      status: 'good',
      details: {
        Frame: { number: 2, length: 120, timestamp: '2025-06-01 10:00:01.250' },
        Ethernet: { src_mac: 'AA:BB:CC:DD:EE:FF', dst_mac: '00:11:22:33:44:55', type: 'IPv4 (0x0800)' },
        IPv4: { version: 4, header_length: 20, src_ip: '192.168.1.1', dst_ip: '192.168.1.100', protocol: 'UDP (17)', ttl: 64 },
        UDP: { src_port: 53, dst_port: 53456, length: 100, checksum: '0xEFGH (correct)' },
        DNS: {
          transaction_id: '0x1234',
          flags: { query: false, response: true, recursion_available: true },
          answers: [{ name: 'google.com', type: 'A', class: 'IN', ttl: 300, address: '93.184.216.34' }],
        },
      },
    },
    {
      id: 'pkt3',
      timestamp: '2025-06-01 10:00:02.010',
      source: '10.0.0.5',
      destination: '172.16.0.20',
      protocol: 'TCP',
      length: 74,
      info: '443 → 51234 [SYN] Seq=0 Win=64240 Len=0 MSS=1460',
      status: 'good',
      details: {
        Frame: { number: 3, length: 74, timestamp: '2025-06-01 10:00:02.010' },
        Ethernet: { src_mac: 'BB:BB:BB:BB:BB:BB', dst_mac: 'CC:CC:CC:CC:CC:CC', type: 'IPv4 (0x0800)' },
        IPv4: { src_ip: '10.0.0.5', dst_ip: '172.16.0.20', protocol: 'TCP (6)' },
        TCP: { src_port: 443, dst_port: 51234, sequence_number: 0, acknowledge_number: 0, flags: { SYN: true, ACK: false }, window_size: 64240 },
      },
    },
    {
      id: 'pkt4',
      timestamp: '2025-06-01 10:00:02.050',
      source: '172.16.0.20',
      destination: '10.0.0.5',
      protocol: 'TCP',
      length: 60,
      info: '51234 → 443 [SYN, ACK] Seq=0 Ack=1 Win=65535 Len=0',
      status: 'good',
      details: {
        Frame: { number: 4, length: 60, timestamp: '2025-06-01 10:00:02.050' },
        Ethernet: { src_mac: 'CC:CC:CC:CC:CC:CC', dst_mac: 'BB:BB:BB:BB:BB:BB', type: 'IPv4 (0x0800)' },
        IPv4: { src_ip: '172.16.0.20', dst_ip: '10.0.0.5', protocol: 'TCP (6)' },
        TCP: { src_port: 51234, dst_port: 443, sequence_number: 0, acknowledge_number: 1, flags: { SYN: true, ACK: true }, window_size: 65535 },
      },
    },
    {
      id: 'pkt5',
      timestamp: '2025-06-01 10:00:02.100',
      source: '10.0.0.5',
      destination: '172.16.0.20',
      protocol: 'TCP',
      length: 54,
      info: '443 → 51234 [ACK] Seq=1 Ack=1 Win=64240 Len=0',
      status: 'good',
      details: {
        Frame: { number: 5, length: 54, timestamp: '2025-06-01 10:00:02.100' },
        Ethernet: '...',
        IPv4: { src_ip: '10.0.0.5', dst_ip: '172.16.0.20', protocol: 'TCP (6)' },
        TCP: { src_port: 443, dst_port: 51234, sequence_number: 1, acknowledge_number: 1, flags: { ACK: true }, window_size: 64240 },
      },
    },
    {
      id: 'pkt6',
      timestamp: '2025-06-01 10:00:03.400',
      source: '192.168.1.100',
      destination: '203.0.113.45',
      protocol: 'HTTP',
      length: 300,
      info: 'GET /api/data HTTP/1.1 (Host: example.com)',
      status: 'good',
      details: {
        Frame: { number: 6, length: 300, timestamp: '2025-06-01 10:00:03.400' },
        Ethernet: '...',
        IPv4: { src_ip: '192.168.1.100', dst_ip: '203.0.113.45', protocol: 'TCP (6)' },
        TCP: { src_port: 54321, dst_port: 80, flags: { PSH: true, ACK: true }, sequence_number: 100, length: 246 },
        HTTP: { method: 'GET', uri: '/api/data', version: 'HTTP/1.1', host: 'example.com', 'User-Agent': 'Mozilla/5.0' },
      },
    },
    {
      id: 'pkt7',
      timestamp: '2025-06-01 10:00:03.650',
      source: '203.0.113.45',
      destination: '192.168.1.100',
      protocol: 'HTTP',
      length: 800,
      info: 'HTTP/1.1 200 OK (application/json)',
      status: 'good',
      details: {
        Frame: { number: 7, length: 800, timestamp: '2025-06-01 10:00:03.650' },
        Ethernet: '...',
        IPv4: { src_ip: '203.0.113.45', dst_ip: '192.168.1.100', protocol: 'TCP (6)' },
        TCP: { src_port: 80, dst_port: 54321, flags: { PSH: true, ACK: true }, sequence_number: 200, length: 746 },
        HTTP: {
          status_code: 200,
          status_phrase: 'OK',
          version: 'HTTP/1.1',
          'Content-Type': 'application/json',
          'Content-Length': 500,
          body_preview: '{ "status": "success", "data": { "key": "value", "items": ["item1", "item2"] } }',
        },
      },
    },
    {
      id: 'pkt8',
      timestamp: '2025-06-01 10:00:04.110',
      source: '192.168.1.100',
      destination: '8.8.4.4',
      protocol: 'ICMP',
      length: 74,
      info: 'Echo (ping) request id=0x2, seq=1',
      status: 'good',
      details: {
        Frame: { number: 8, length: 74, timestamp: '2025-06-01 10:00:04.110' },
        Ethernet: '...',
        IPv4: { src_ip: '192.168.1.100', dst_ip: '8.8.4.4', protocol: 'ICMP (1)' },
        ICMP: { type: 'Echo request (8)', code: 0, checksum: '0x123F (correct)', identifier: '0x0002', sequence_number: 1, data: '0102030405060708' },
      },
    },
    {
      id: 'pkt9',
      timestamp: '2025-06-01 10:00:04.150',
      source: '8.8.4.4',
      destination: '192.168.1.100',
      protocol: 'ICMP',
      length: 74,
      info: 'Echo (ping) reply id=0x2, seq=1',
      status: 'good',
      details: {
        Frame: { number: 9, length: 74, timestamp: '2025-06-01 10:00:04.150' },
        Ethernet: '...',
        IPv4: { src_ip: '8.8.4.4', dst_ip: '192.168.1.100', protocol: 'ICMP (1)' },
        ICMP: { type: 'Echo reply (0)', code: 0, checksum: '0x456A (correct)', identifier: '0x0002', sequence_number: 1, data: '0102030405060708' },
      },
    },
    {
      id: 'pkt10',
      timestamp: '2025-06-01 10:00:05.000',
      source: '10.0.0.15',
      destination: '10.0.0.2',
      protocol: 'ARP',
      length: 42,
      info: 'Who has 10.0.0.2? Tell 10.0.0.15',
      status: 'good',
      details: {
        Frame: { number: 10, length: 42, timestamp: '2025-06-01 10:00:05.000' },
        Ethernet: { src_mac: 'DD:DD:DD:DD:DD:DD', dst_mac: 'FF:FF:FF:FF:FF:FF', type: 'ARP (0x0806)' },
        ARP: {
          hardware_type: 'Ethernet (1)',
          protocol_type: 'IPv4 (0x0800)',
          hardware_size: 6,
          protocol_size: 4,
          opcode: 'request (1)',
          sender_mac: 'DD:DD:DD:DD:DD:DD',
          sender_ip: '10.0.0.15',
          target_mac: '00:00:00:00:00:00',
          target_ip: '10.0.0.2',
        },
      },
    },
    {
      id: 'pkt11',
      timestamp: '2025-06-01 10:00:05.050',
      source: '10.0.0.2',
      destination: '10.0.0.15',
      protocol: 'ARP',
      length: 42,
      info: '10.0.0.2 is at 00:0C:29:1A:2B:3C',
      status: 'good',
      details: {
        Frame: { number: 11, length: 42, timestamp: '2025-06-01 10:00:05.050' },
        Ethernet: { src_mac: '00:0C:29:1A:2B:3C', dst_mac: 'DD:DD:DD:DD:DD:DD', type: 'ARP (0x0806)' },
        ARP: {
          hardware_type: 'Ethernet (1)',
          protocol_type: 'IPv4 (0x0800)',
          hardware_size: 6,
          protocol_size: 4,
          opcode: 'reply (2)',
          sender_mac: '00:0C:29:1A:2B:3C',
          sender_ip: '10.0.0.2',
          target_mac: 'DD:DD:DD:DD:DD:DD',
          target_ip: '10.0.0.15',
        },
      },
    },
    {
      id: 'pkt12',
      timestamp: '2025-06-01 10:00:06.000',
      source: '192.168.1.100',
      destination: '1.2.3.4',
      protocol: 'UDP',
      length: 90,
      info: 'UDP broadcast message',
      status: 'warning', // Example of a warning packet
      details: {
        Frame: { number: 12, length: 90, timestamp: '2025-06-01 10:00:06.000' },
        Ethernet: '...',
        IPv4: { src_ip: '192.168.1.100', dst_ip: '255.255.255.255', protocol: 'UDP (17)' },
        UDP: { src_port: 10000, dst_port: 10001, length: 70 },
        Data: { payload: 'Hello Network!' }
      },
    },
    {
      id: 'pkt13',
      timestamp: '2025-06-01 10:00:06.500',
      source: '172.16.0.20',
      destination: '10.0.0.5',
      protocol: 'TCP',
      length: 60,
      info: '51234 → 443 [ACK] Seq=2 Ack=2 Win=65535 Len=0 (Previous segment not captured)',
      status: 'error', // Example of an error packet
      details: {
        Frame: { number: 13, length: 60, timestamp: '2025-06-01 10:00:06.500' },
        Ethernet: '...',
        IPv4: { src_ip: '172.16.0.20', dst_ip: '10.0.0.5', protocol: 'TCP (6)' },
        TCP: { src_port: 51234, dst_port: 443, sequence_number: 2, acknowledge_number: 2, flags: { ACK: true }, window_size: 65535, calculated_checksum: '0x1234', actual_checksum: '0x1233 (incorrect)' },
        Troubleshooting: { hint: 'Possible retransmission or packet loss' }
      },
    },
  ];

  // Debounce filter for performance
  const debouncedFilter = useDebounce(filter, 300);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filter packets based on filter input and search term
  const filteredPackets = packets.filter((pkt) => {
    const filterMatch =
      pkt.source.toLowerCase().includes(debouncedFilter.toLowerCase()) ||
      pkt.destination.toLowerCase().includes(debouncedFilter.toLowerCase()) ||
      pkt.protocol.toLowerCase().includes(debouncedFilter.toLowerCase()) ||
      pkt.info.toLowerCase().includes(debouncedFilter.toLowerCase()) ||
      pkt.timestamp.toLowerCase().includes(debouncedFilter.toLowerCase());

    const searchMatch =
      debouncedSearchTerm === '' ||
      JSON.stringify(pkt).toLowerCase().includes(debouncedSearchTerm.toLowerCase()); // Search across all fields, including nested details

    // Apply conversation filter if active
    const conversationMatch = !conversationFilter ||
      ((pkt.source === conversationFilter.source && pkt.destination === conversationFilter.destination) ||
        (pkt.source === conversationFilter.destination && pkt.destination === conversationFilter.source));

    return filterMatch && searchMatch && conversationMatch;
  });

  // Simulate packet capture every 1.5 seconds
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
  }, [isCapturing, allPackets.length]); // Add allPackets.length as dependency

  // Stop capturing when packets exhausted
  useEffect(() => {
    if (packetIndexRef.current >= allPackets.length && isCapturing) {
      setIsCapturing(false);
      alert('All simulated packets have been captured.');
    }
  }, [packets, isCapturing, allPackets.length]);

  const handleStart = () => {
    if (packetIndexRef.current >= allPackets.length) {
      alert('All simulated packets have been captured. Please reload to start over.');
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
    setFilter('');
    setSearchTerm('');
    setConversationFilter(null);
  };

  const handleSelect = (pkt) => {
    setSelectedPacket(pkt);
    setConversationFilter(null); // Clear conversation filter when a new packet is selected directly
  };

  const handleFollowConversation = (pkt) => {
    if (pkt) {
      setConversationFilter({ source: pkt.source, destination: pkt.destination });
      setSelectedPacket(pkt); // Keep selected packet for details
    } else {
      setConversationFilter(null); // Clear conversation filter
    }
  };


  return (
    <>
      <Ribbon
        filter={filter}
        onFilterChange={setFilter}
        onStart={handleStart}
        onStop={handleStop}
        onReload={handleReload}
        isCapturing={isCapturing}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      />
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          padding: '1rem',
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#0b1a38',
          // Adjusted height calculation: 100vh - (Ribbon Height + Main Container Top/Bottom Padding)
          // Assuming Ribbon height is fixed, e.g., ~60px + 0.75rem*2 = 72px + 1.5rem = ~96px
          // A safer approach is `calc(100vh - <fixed_ribbon_height> - <total_vertical_padding>)`
          // Let's assume the ribbon is roughly 60px in height + 0.75rem top/bottom padding = 72px
          // The main container itself has 1rem (16px) top and bottom padding = 32px
          // So, total fixed height to subtract: 72px + 32px = 104px.
          // Using `calc(100vh - 104px)` for the main content area should work.
          height: 'calc(100vh - 72px)', // Assuming Ribbon is around 72px (from previous calculations)
                                          // and we want to fill the rest. No need for min/max
                                          // if we ensure flex-grow items fill the space.
          overflow: 'hidden', // Prevents outer scrollbar, internal components handle their own
        }}
      >
        <div
          style={{
            flex: 2, /* This takes 2 parts of the available space */
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            borderRight: '2px solid #4fc3f744',
            paddingRight: '1rem',
            overflowY: 'hidden', // Handled by NetworkTable's internal scroll
          }}
        >
          {conversationFilter && (
            <div style={{ color: '#ffeb3b', padding: '0.5rem', backgroundColor: '#3f51b533', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Showing conversation between {conversationFilter.source} and {conversationFilter.destination}.</span>
              <button
                onClick={() => handleFollowConversation(null)}
                style={{
                  backgroundColor: '#dc3545', // Danger red
                  border: 'none',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '3px',
                  color: '#e0f2f7',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                }}
                title="Clear conversation filter"
              >
                Clear
              </button>
            </div>
          )}
          <NetworkTable
            packets={filteredPackets}
            onSelect={handleSelect}
            selectedPacket={selectedPacket}
            onFollowConversation={handleFollowConversation}
          />
        </div>
        <div
          style={{
            flex: 1, /* This takes 1 part of the available space */
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            overflowY: 'hidden', // Managed by its children
          }}
        >
          <PacketDiagram packet={selectedPacket} />
          <PacketDetails packet={selectedPacket} onFollowConversation={handleFollowConversation} />
          <SummaryPanel packets={packets} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;