import React, { useState } from 'react';

// Dummy data for SIP call flows
const dummySipCalls = [
  {
    id: 'call-001',
    callId: 'j8d9c7s@192.168.1.10',
    fromUser: 'Alice <sip:alice@example.com>',
    toUser: 'Bob <sip:bob@example.com>',
    startTime: '2025-05-26 14:30:00',
    status: 'Completed',
    duration: '120s',
    messages: [
      { id: 1, timeOffset: '0.000', source: '192.168.1.10', destination: 'sip.example.com', method: 'INVITE', cseq: '1 INVITE', status: 'N/A', info: 'Alice to Bob' },
      { id: 2, timeOffset: '0.050', source: 'sip.example.com', destination: '192.168.1.10', method: '100 Trying', cseq: '1 INVITE', status: 'N/A', info: '' },
      { id: 3, timeOffset: '1.500', source: 'sip.example.com', destination: '192.168.1.10', method: '180 Ringing', cseq: '1 INVITE', status: 'N/A', info: '' },
      { id: 4, timeOffset: '5.200', source: 'sip.example.com', destination: '192.168.1.10', method: '200 OK', cseq: '1 INVITE', status: 'N/A', info: 'SDP' },
      { id: 5, timeOffset: '5.250', source: '192.168.1.10', destination: 'sip.example.com', method: 'ACK', cseq: '1 ACK', status: 'N/A', info: '' },
      { id: 6, timeOffset: '125.000', source: '192.168.1.10', destination: 'sip.example.com', method: 'BYE', cseq: '2 BYE', status: 'N/A', info: '' },
      { id: 7, timeOffset: '125.050', source: 'sip.example.com', destination: '192.168.1.10', method: '200 OK', cseq: '2 BYE', status: 'N/A', info: '' },
    ],
  },
  {
    id: 'call-002',
    callId: 'f7e2p9a@10.0.0.5',
    fromUser: 'Charlie <sip:charlie@other.org>',
    toUser: 'Dave <sip:dave@other.org>',
    startTime: '2025-05-26 15:05:00',
    status: 'Failed (404 Not Found)',
    duration: '5s',
    messages: [
      { id: 1, timeOffset: '0.000', source: '10.0.0.5', destination: 'sip.other.org', method: 'INVITE', cseq: '1 INVITE', status: 'N/A', info: 'Charlie to Dave' },
      { id: 2, timeOffset: '0.100', source: 'sip.other.org', destination: '10.0.0.5', method: '404 Not Found', cseq: '1 INVITE', status: 'N/A', info: '' },
      { id: 3, timeOffset: '0.150', source: '10.0.0.5', destination: 'sip.other.org', method: 'ACK', cseq: '1 ACK', status: 'N/A', info: '' },
    ],
  },
  {
    id: 'call-003',
    callId: 'x1y2z3a@172.16.0.1',
    fromUser: 'Eve <sip:eve@domain.net>',
    toUser: 'Frank <sip:frank@domain.net>',
    startTime: '2025-05-26 16:10:00',
    status: 'Completed',
    duration: '60s',
    messages: [
      { id: 1, timeOffset: '0.000', source: '172.16.0.1', destination: 'proxy.domain.net', method: 'INVITE', cseq: '1 INVITE', status: 'N/A', info: 'Eve to Frank' },
      { id: 2, timeOffset: '0.030', source: 'proxy.domain.net', destination: '172.16.0.1', method: '100 Trying', cseq: '1 INVITE', status: 'N/A', info: '' },
      { id: 3, timeOffset: '0.500', source: 'proxy.domain.net', destination: '172.16.0.1', method: '200 OK', cseq: '1 INVITE', status: 'N/A', info: 'SDP' },
      { id: 4, timeOffset: '0.550', source: '172.16.0.1', destination: 'proxy.domain.net', method: 'ACK', cseq: '1 ACK', status: 'N/A', info: '' },
      { id: 5, timeOffset: '60.000', source: '172.16.0.1', destination: 'proxy.domain.net', method: 'CANCEL', cseq: '2 CANCEL', status: 'N/A', info: '' },
      { id: 6, timeOffset: '60.020', source: 'proxy.domain.net', destination: '172.16.0.1', method: '200 OK', cseq: '2 CANCEL', status: 'N/A', info: '' },
    ],
  },
];

const SipFlows = () => {
  const [sipCalls, setSipCalls] = useState(dummySipCalls);
  const [selectedCall, setSelectedCall] = useState(null);
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
    messageList: {
      listStyle: 'none',
      padding: '0',
      margin: '0',
    },
    messageItem: {
      backgroundColor: '#4a4a4a',
      padding: '8px 12px',
      marginBottom: '5px',
      borderRadius: '4px',
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
    },
    messageProp: {
      fontWeight: 'bold',
      color: '#ADD8E6', // Light blue for property names
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
  };

  const filteredCalls = sipCalls.filter(call =>
    Object.values(call).some(value =>
      String(value).toLowerCase().includes(filterText.toLowerCase())
    ) ||
    call.messages.some(msg =>
      Object.values(msg).some(msgValue =>
        String(msgValue).toLowerCase().includes(filterText.toLowerCase())
      )
    )
  );

  const handleCallClick = (call) => {
    setSelectedCall(call);
  };

  const closeDetails = () => {
    setSelectedCall(null);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>SIP Flows</h2>
      <p>Analyze SIP (Session Initiation Protocol) call setup, modification, and teardown flows.</p>

      <input
        type="text"
        placeholder="Filter calls..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={styles.filterInput}
      />

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Call ID (Short)</th>
              <th style={styles.th}>From User</th>
              <th style={styles.th}>To User</th>
              <th style={styles.th}>Start Time</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Duration</th>
            </tr>
          </thead>
          <tbody>
            {filteredCalls.length > 0 ? (
              filteredCalls.map((call) => (
                <tr
                  key={call.id}
                  onClick={() => handleCallClick(call)}
                  style={{
                    ...styles.td,
                    ...styles.tableRowHover,
                    ...(selectedCall && selectedCall.id === call.id ? styles.selectedRow : {}),
                  }}
                >
                  <td style={styles.td}>{call.callId.substring(0, 10)}...</td> {/* Shorten for display */}
                  <td style={styles.td}>{call.fromUser}</td>
                  <td style={styles.td}>{call.toUser}</td>
                  <td style={styles.td}>{call.startTime}</td>
                  <td style={styles.td}>{call.status}</td>
                  <td style={styles.td}>{call.duration}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#aaa' }}>No SIP call flows found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedCall && (
        <div style={styles.detailsSection}>
          <h3 style={styles.detailsHeader}>SIP Call Flow Details for {selectedCall.callId.substring(0, 20)}...</h3>
          <p><strong>From:</strong> {selectedCall.fromUser} <strong>To:</strong> {selectedCall.toUser}</p>
          <p><strong>Call ID:</strong> {selectedCall.callId}</p>
          <p><strong>Status:</strong> {selectedCall.status} <strong>Duration:</strong> {selectedCall.duration}</p>

          <h4 style={{ ...styles.detailsHeader, marginTop: '20px' }}>Message Sequence:</h4>
          <ul style={styles.messageList}>
            {selectedCall.messages.map(message => (
              <li key={message.id} style={styles.messageItem}>
                <div><span style={styles.messageProp}>Time:</span> {message.timeOffset}s</div>
                <div><span style={styles.messageProp}>Source:</span> {message.source}</div>
                <div><span style={styles.messageProp}>Dest:</span> {message.destination}</div>
                <div><span style={styles.messageProp}>Method:</span> {message.method}</div>
                <div><span style={styles.messageProp}>CSeq:</span> {message.cseq}</div>
                {message.info && <div><span style={styles.messageProp}>Info:</span> {message.info}</div>}
              </li>
            ))}
          </ul>
          {/* In a real Wireshark-like tool, you'd have options for:
              - Flow Diagram (requires a charting library like D3.js or custom SVG drawing)
              - Playback (if associated with RTP)
              - Export Messages
              - More detailed message content on click
          */}
          <button onClick={closeDetails} style={styles.closeButton}>
            Close Details
          </button>
        </div>
      )}
    </div>
  );
};

export default SipFlows;