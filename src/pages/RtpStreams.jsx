import React, { useState, useEffect } from 'react';

const dummyRtpStreams = [
  {
    id: 'rtp-stream-1',
    sourceIP: '192.168.1.10',
    sourcePort: '4000',
    destIP: '192.168.1.20',
    destPort: '5000',
    codec: 'G.711 (PCMU)',
    payloadType: 0,
    packets: 1500,
    loss: '2%',
    jitter: '10ms',
    delay: '50ms',
    duration: '30s',
    ssrc: '0x12345678',
    details: 'This is a sample VoIP call stream.',
  },
  {
    id: 'rtp-stream-2',
    sourceIP: '10.0.0.5',
    sourcePort: '6000',
    destIP: '172.16.0.10',
    destPort: '7000',
    codec: 'G.729',
    payloadType: 18,
    packets: 800,
    loss: '0.5%',
    jitter: '5ms',
    delay: '40ms',
    duration: '20s',
    ssrc: '0x87654321',
    details: 'Another VoIP call, lower bandwidth codec.',
  },
  {
    id: 'rtp-stream-3',
    sourceIP: '192.168.1.50',
    sourcePort: '8000',
    destIP: '192.168.1.60',
    destPort: '9000',
    codec: 'Opus',
    payloadType: 111,
    packets: 2500,
    loss: '0%',
    jitter: '2ms',
    delay: '30ms',
    duration: '45s',
    ssrc: '0xABCDEF01',
    details: 'High-quality audio stream example.',
  },
];

const RtpStreams = () => {
  const [rtpStreams, setRtpStreams] = useState(dummyRtpStreams);
  const [selectedStream, setSelectedStream] = useState(null);
  const [filterText, setFilterText] = useState('');

  // Styles for a Wireshark-like dark theme
  const styles = {
    container: {
      backgroundColor: '#2b2b2b', // Dark background
      color: '#e0e0e0', // Light text
      fontFamily: 'Consolas, Monaco, monospace', // Monospaced font
      padding: '20px',
      minHeight: 'calc(100vh - 120px)', // Adjust for header/footer
      overflowY: 'auto',
    },
    header: {
      color: '#ADD8E6', // Light blue for headers
      marginBottom: '15px',
      borderBottom: '1px solid #555',
      paddingBottom: '10px',
    },
    filterInput: {
      backgroundColor: '#3c3c3c',
      border: '1px solid #555',
      color: '#e0e0e0',
      padding: '8px',
      borderRadius: '4px',
      marginBottom: '20px',
      width: '300px',
    },
    tableContainer: {
      overflowX: 'auto',
      marginBottom: '20px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#3c3c3c',
    },
    th: {
      backgroundColor: '#555',
      color: '#fff',
      padding: '10px',
      textAlign: 'left',
      border: '1px solid #444',
      cursor: 'pointer', // Indicate sortable (if implemented)
    },
    td: {
      padding: '10px',
      border: '1px solid #444',
      whiteSpace: 'nowrap', // Prevent text wrapping
    },
    tableRowHover: {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#4a4a4a', // Darker on hover
      },
    },
    selectedRow: {
      backgroundColor: '#6a5acd !important', // Slate Blue for selected row
      color: '#fff',
    },
    detailsSection: {
      backgroundColor: '#3c3c3c',
      border: '1px solid #555',
      padding: '15px',
      borderRadius: '8px',
      marginTop: '20px',
    },
    detailsHeader: {
      color: '#ADD8E6',
      marginBottom: '10px',
    },
    detailItem: {
      marginBottom: '8px',
    },
    closeButton: {
      backgroundColor: '#6a5acd',
      color: '#fff',
      border: 'none',
      padding: '8px 15px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '15px',
      '&:hover': {
        backgroundColor: '#7b68ee',
      },
    },
    // Adding a class for hover effect on rows (needs actual CSS or Emotion/styled-components for true hover)
    // For inline styles, we often resort to JS event handlers or just omit complex pseudo-classes.
    // For simplicity, we'll use a direct style for selected row.
  };

  const filteredStreams = rtpStreams.filter(stream =>
    Object.values(stream).some(value =>
      String(value).toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const handleStreamClick = (stream) => {
    setSelectedStream(stream);
  };

  const closeDetails = () => {
    setSelectedStream(null);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>RTP Streams</h2>
      <p>Inspect and analyze Real-time Transport Protocol (RTP) stream data.</p>

      <input
        type="text"
        placeholder="Filter streams..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={styles.filterInput}
      />

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Source IP:Port</th>
              <th style={styles.th}>Destination IP:Port</th>
              <th style={styles.th}>Codec</th>
              <th style={styles.th}>Payload Type</th>
              <th style={styles.th}>Packets</th>
              <th style={styles.th}>Loss</th>
              <th style={styles.th}>Jitter</th>
              <th style={styles.th}>Delay</th>
              <th style={styles.th}>Duration</th>
            </tr>
          </thead>
          <tbody>
            {filteredStreams.length > 0 ? (
              filteredStreams.map((stream) => (
                <tr
                  key={stream.id}
                  onClick={() => handleStreamClick(stream)}
                  style={{
                    ...styles.td, // Apply base td style for row padding
                    ...styles.tableRowHover, // Pseudo-class for hover
                    ...(selectedStream && selectedStream.id === stream.id ? styles.selectedRow : {}),
                  }}
                >
                  <td style={styles.td}>{stream.id.split('-')[2]}</td> {/* Display just the number */}
                  <td style={styles.td}>{stream.sourceIP}:{stream.sourcePort}</td>
                  <td style={styles.td}>{stream.destIP}:{stream.destPort}</td>
                  <td style={styles.td}>{stream.codec}</td>
                  <td style={styles.td}>{stream.payloadType}</td>
                  <td style={styles.td}>{stream.packets}</td>
                  <td style={styles.td}>{stream.loss}</td>
                  <td style={styles.td}>{stream.jitter}</td>
                  <td style={styles.td}>{stream.delay}</td>
                  <td style={styles.td}>{stream.duration}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ ...styles.td, textAlign: 'center', color: '#aaa' }}>No RTP streams found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedStream && (
        <div style={styles.detailsSection}>
          <h3 style={styles.detailsHeader}>Details for RTP Stream {selectedStream.id.split('-')[2]}</h3>
          <p style={styles.detailItem}><strong>Source:</strong> {selectedStream.sourceIP}:{selectedStream.sourcePort}</p>
          <p style={styles.detailItem}><strong>Destination:</strong> {selectedStream.destIP}:{selectedStream.destPort}</p>
          <p style={styles.detailItem}><strong>Codec:</strong> {selectedStream.codec}</p>
          <p style={styles.detailItem}><strong>Payload Type:</strong> {selectedStream.payloadType}</p>
          <p style={styles.detailItem}><strong>Packets:</strong> {selectedStream.packets}</p>
          <p style={styles.detailItem}><strong>Packet Loss:</strong> {selectedStream.loss}</p>
          <p style={styles.detailItem}><strong>Jitter:</strong> {selectedStream.jitter}</p>
          <p style={styles.detailItem}><strong>Delay:</strong> {selectedStream.delay}</p>
          <p style={styles.detailItem}><strong>Duration:</strong> {selectedStream.duration}</p>
          <p style={styles.detailItem}><strong>SSRC:</strong> {selectedStream.ssrc}</p>
          <p style={styles.detailItem}><strong>Description:</strong> {selectedStream.details}</p>
          {/* In a real Wireshark-like tool, you'd have options here for:
              - Playback (would require Web Audio API and actual audio data)
              - Graph (would require charting library like Chart.js, Recharts, or D3)
              - Export
              - More detailed packet list for this stream
          */}
          <button onClick={closeDetails} style={styles.closeButton}>
            Close Details
          </button>
        </div>
      )}
    </div>
  );
};

export default RtpStreams;