// src/components/SipFlows.jsx
import React, { useState, useEffect } from 'react';

// Updated dummy data for SIP call flows with new names and emails
const dummySipCalls = [
  {
    id: 'call-ax7yt8z',
    callId: 'ax7yt8z@pbx.corporate.com',
    fromUser: 'Pranav <sip:pranav@corporate.com>',
    toUser: 'Divya <sip:divya@corporate.com>',
    startTime: '2025-05-27 09:00:00',
    status: 'Completed',
    duration: '90s',
    messages: [
      { id: 1, timeOffset: '0.000', source: '10.0.0.100', destination: 'pbx.corporate.com', method: 'INVITE', cseq: '1 INVITE', status: 'N/A', info: 'Pranav calling Divya' },
      { id: 2, timeOffset: '0.045', source: 'pbx.corporate.com', destination: '10.0.0.100', method: '100 Trying', cseq: '1 INVITE', status: 'N/A', info: '' },
      { id: 3, timeOffset: '1.200', source: 'pbx.corporate.com', destination: '10.0.0.100', method: '180 Ringing', cseq: '1 INVITE', status: 'N/A', info: '' },
      { id: 4, timeOffset: '4.500', source: 'pbx.corporate.com', destination: '10.0.0.100', method: '200 OK', cseq: '1 INVITE', status: 'N/A', info: 'SDP from Divya' },
      { id: 5, timeOffset: '4.580', source: '10.0.0.100', destination: 'pbx.corporate.com', method: 'ACK', cseq: '1 ACK', status: 'N/A', info: '' },
      { id: 6, timeOffset: '94.000', source: '10.0.0.100', destination: 'pbx.corporate.com', method: 'BYE', cseq: '2 BYE', status: 'N/A', info: '' },
      { id: 7, timeOffset: '94.030', source: 'pbx.corporate.com', destination: '10.0.0.100', method: '200 OK', cseq: '2 BYE', status: 'N/A', info: '' },
    ],
  },
  {
    id: 'call-wq2bn3m',
    callId: 'wq2bn3m@voip.service.net',
    fromUser: 'Rahul <sip:rahul.s@service.net>',
    toUser: 'Priya <sip:priya.k@service.net>',
    startTime: '2025-05-27 10:15:30',
    status: 'Failed (480 Temporarily Unavailable)',
    duration: '7s',
    messages: [
      { id: 1, timeOffset: '0.000', source: '192.168.5.50', destination: 'voip.service.net', method: 'INVITE', cseq: '1 INVITE', status: 'N/A', info: 'Rahul to Priya' },
      { id: 2, timeOffset: '0.090', source: 'voip.service.net', destination: '192.168.5.50', method: '480 Temporarily Unavailable', cseq: '1 INVITE', status: 'N/A', info: 'User busy or unreachable' },
      { id: 3, timeOffset: '0.140', source: '192.168.5.50', destination: 'voip.service.net', method: 'ACK', cseq: '1 ACK', status: 'N/A', info: '' },
    ],
  },
  {
    id: 'call-lp8ko9q',
    callId: 'lp8ko9q@cloud.comm.org',
    fromUser: 'Sneha <sip:sneha.j@cloud.comm.org>',
    toUser: 'Amit <sip:amit.v@cloud.comm.org>',
    startTime: '2025-05-27 11:40:10',
    status: 'In-Progress',
    duration: '35s', // Still ongoing
    messages: [
      { id: 1, timeOffset: '0.000', source: '172.20.1.1', destination: 'cloud.comm.org', method: 'INVITE', cseq: '1 INVITE', status: 'N/A', info: 'Sneha to Amit' },
      { id: 2, timeOffset: '0.025', source: 'cloud.comm.org', destination: '172.20.1.1', method: '100 Trying', cseq: '1 INVITE', status: 'N/A', info: '' },
      { id: 3, timeOffset: '0.400', source: 'cloud.comm.org', destination: '172.20.1.1', method: '200 OK', cseq: '1 INVITE', status: 'N/A', info: 'SDP' },
      { id: 4, timeOffset: '0.450', source: '172.20.1.1', destination: 'cloud.comm.org', method: 'ACK', cseq: '1 ACK', status: 'N/A', info: '' },
      // Call is still in progress, so no BYE yet
    ],
  },
  {
    id: 'call-zx1cv2b',
    callId: 'zx1cv2b@branch.office.com',
    fromUser: 'Anjali <sip:anjali@branch.office.com>',
    toUser: 'Vikram <sip:vikram@main.office.com>',
    startTime: '2025-05-27 13:00:00',
    status: 'Completed',
    duration: '180s',
    messages: [
      { id: 1, timeOffset: '0.000', source: '192.168.20.5', destination: 'proxy.main.office.com', method: 'INVITE', cseq: '1 INVITE', status: 'N/A', info: 'Anjali to Vikram' },
      { id: 2, timeOffset: '0.070', source: 'proxy.main.office.com', destination: '192.168.20.5', method: '100 Trying', cseq: '1 INVITE', status: 'N/A', info: '' },
      { id: 3, timeOffset: '1.100', source: 'proxy.main.office.com', destination: '192.168.20.5', method: '183 Session Progress', cseq: '1 INVITE', status: 'N/A', info: 'Early Media' },
      { id: 4, timeOffset: '6.000', source: 'proxy.main.office.com', destination: '192.168.20.5', method: '200 OK', cseq: '1 INVITE', status: 'N/A', info: 'SDP' },
      { id: 5, timeOffset: '6.050', source: '192.168.20.5', destination: 'proxy.main.office.com', method: 'ACK', cseq: '1 ACK', status: 'N/A', info: '' },
      { id: 6, timeOffset: '186.000', source: '192.168.20.5', destination: 'proxy.main.office.com', method: 'BYE', cseq: '2 BYE', status: 'N/A', info: '' },
      { id: 7, timeOffset: '186.030', source: 'proxy.main.office.com', destination: '192.168.20.5', method: '200 OK', cseq: '2 BYE', status: 'N/A', info: '' },
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
      minHeight: 'calc(100vh - 40px)', // Adjust for potential overall padding
      overflowY: 'auto',
      boxSizing: 'border-box',
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
      outline: 'none',
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
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    },
    td: {
      padding: '10px',
      border: '1px solid #444',
      whiteSpace: 'nowrap',
    },
    tableRowBase: {
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    },
    tableRowHover: {
      backgroundColor: '#4a4a4a',
    },
    selectedRow: {
      backgroundColor: '#6a5acd',
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
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: '15px',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    messageProp: {
      fontWeight: 'bold',
      color: '#ADD8E6',
    },
    closeButton: {
      backgroundColor: '#6a5acd',
      color: '#fff',
      border: 'none',
      padding: '8px 15px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '15px',
      transition: 'background-color 0.2s ease',
    },
    closeButtonHover: {
      backgroundColor: '#7b68ee',
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
      <h2 style={styles.header}>SIP Flows Analyzer</h2>
      <p>Analyze Session Initiation Protocol (SIP) call setup, modification, and teardown flows.</p>

      <input
        type="text"
        placeholder="Filter calls (e.g., name, IP, status)..."
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
                    ...styles.tableRowBase,
                    backgroundColor: (selectedCall && selectedCall.id === call.id)
                      ? styles.selectedRow.backgroundColor
                      : styles.table.backgroundColor,
                  }}
                  onMouseEnter={(e) => {
                    if (!(selectedCall && selectedCall.id === call.id)) {
                      e.currentTarget.style.backgroundColor = styles.tableRowHover.backgroundColor;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!(selectedCall && selectedCall.id === call.id)) {
                      e.currentTarget.style.backgroundColor = styles.table.backgroundColor;
                    }
                  }}
                >
                  <td style={styles.td}>{call.callId.substring(0, 15)}...</td>
                  <td style={styles.td}>{call.fromUser}</td>
                  <td style={styles.td}>{call.toUser}</td>
                  <td style={styles.td}>{call.startTime}</td>
                  <td style={styles.td}>{call.status}</td>
                  <td style={styles.td}>{call.duration}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#aaa' }}>No SIP call flows found matching your filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedCall && (
        <div style={styles.detailsSection}>
          <h3 style={styles.detailsHeader}>SIP Call Flow Details: {selectedCall.callId.substring(0, 25)}...</h3>
          <p>
            <strong>From:</strong> {selectedCall.fromUser} <br/>
            <strong>To:</strong> {selectedCall.toUser}
          </p>
          <p>
            <strong>Full Call ID:</strong> {selectedCall.callId} <br/>
            <strong>Start Time:</strong> {selectedCall.startTime} <br/>
            <strong>Status:</strong> {selectedCall.status} &nbsp; <strong>Duration:</strong> {selectedCall.duration}
          </p>

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
          <button
            onClick={closeDetails}
            style={styles.closeButton}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.closeButtonHover.backgroundColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.closeButton.backgroundColor)}
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
};

export default SipFlows;