import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

// Dummy data for VoIP Calls
const dummyVoipCalls = [
  {
    id: 'voip-call-001',
    callId: 'j8d9c7s@192.168.1.10',
    from: 'Alice (sip:alice@example.com)',
    to: 'Bob (sip:bob@example.com)',
    startTime: '2025-05-26 14:30:00',
    endTime: '2025-05-26 14:32:00',
    duration: '2m 0s',
    status: 'Completed',
    protocol: 'SIP/RTP',
    sourceIp: '192.168.1.10',
    destIp: '192.168.1.20',
    rtpStreamId: 'rtp-stream-1', // Link to a dummy RTP stream
    sipFlowId: 'call-001',      // Link to a dummy SIP flow
    qualityMetrics: {
      loss: '2%',
      jitter: '10ms',
      mos: '4.1',
    },
    notes: 'Standard internal call, good quality.',
  },
  {
    id: 'voip-call-002',
    callId: 'f7e2p9a@10.0.0.5',
    from: 'Charlie (sip:charlie@other.org)',
    to: 'Dave (sip:dave@other.org)',
    startTime: '2025-05-26 15:05:00',
    endTime: '2025-05-26 15:05:05',
    duration: '0m 5s',
    status: 'Failed (404 Not Found)',
    protocol: 'SIP',
    sourceIp: '10.0.0.5',
    destIp: '172.16.0.10',
    rtpStreamId: null,
    sipFlowId: 'call-002',
    qualityMetrics: {
      loss: 'N/A',
      jitter: 'N/A',
      mos: 'N/A',
    },
    notes: 'Call failed, destination not found.',
  },
  {
    id: 'voip-call-003',
    callId: 'x1y2z3a@172.16.0.1',
    from: 'Eve (sip:eve@domain.net)',
    to: 'Frank (sip:frank@domain.net)',
    startTime: '2025-05-26 16:10:00',
    endTime: '2025-05-26 16:11:00',
    duration: '1m 0s',
    status: 'Completed',
    protocol: 'SIP/RTP',
    sourceIp: '172.16.0.1',
    destIp: '172.16.0.5',
    rtpStreamId: 'rtp-stream-3',
    sipFlowId: 'call-003',
    qualityMetrics: {
      loss: '0%',
      jitter: '2ms',
      mos: '4.5',
    },
    notes: 'Conference call, very good quality.',
  },
];

const VoipCalls = () => {
  const [voipCalls, setVoipCalls] = useState(dummyVoipCalls);
  const [selectedCall, setSelectedCall] = useState(null);
  const [filterText, setFilterText] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  // Styles for a Wireshark-like dark theme (consistent with RTP and SIP flows)
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
    actionButtons: {
      display: 'flex',
      gap: '10px',
      marginTop: '15px',
    },
    button: {
      backgroundColor: '#6a5acd',
      color: '#fff',
      border: 'none',
      padding: '8px 15px',
      borderRadius: '4px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#7b68ee',
      },
      '&:disabled': {
        backgroundColor: '#555',
        cursor: 'not-allowed',
      }
    },
    closeButton: {
      backgroundColor: '#8b0000', // Dark red for close
      color: '#fff',
      border: 'none',
      padding: '8px 15px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '15px',
      '&:hover': {
        backgroundColor: '#a52a2a',
      },
    },
  };

  const filteredCalls = voipCalls.filter(call =>
    Object.values(call).some(value =>
      String(value).toLowerCase().includes(filterText.toLowerCase())
    ) ||
    Object.values(call.qualityMetrics).some(value =>
      String(value).toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const handleCallClick = (call) => {
    setSelectedCall(call);
  };

  const closeDetails = () => {
    setSelectedCall(null);
  };

  const handleAnalyzeSipFlow = () => {
    if (selectedCall && selectedCall.sipFlowId) {
      // In a real app, you might pass the sipFlowId as a state or query param
      // to the SIP Flows page to highlight or filter the specific flow.
      navigate('/sip-flows');
    } else {
      alert('No associated SIP Flow for this call.');
    }
  };

  const handlePlayRtpStreams = () => {
    if (selectedCall && selectedCall.rtpStreamId) {
      // Similarly, navigate to RTP Streams page.
      // You might pass the rtpStreamId to the RTP Streams page for direct analysis.
      navigate('/rtp-streams');
    } else {
      alert('No associated RTP Streams for this call.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>VoIP Calls</h2>
      <p>This page shows detected Voice over IP (VoIP) call sessions summarized from captured traffic.</p>

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
              <th style={styles.th}>From</th>
              <th style={styles.th}>To</th>
              <th style={styles.th}>Start Time</th>
              <th style={styles.th}>Duration</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Protocol</th>
              <th style={styles.th}>MOS (Mean Opinion Score)</th>
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
                  <td style={styles.td}>{call.from}</td>
                  <td style={styles.td}>{call.to}</td>
                  <td style={styles.td}>{call.startTime}</td>
                  <td style={styles.td}>{call.duration}</td>
                  <td style={styles.td}>{call.status}</td>
                  <td style={styles.td}>{call.protocol}</td>
                  <td style={styles.td}>{call.qualityMetrics.mos}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ ...styles.td, textAlign: 'center', color: '#aaa' }}>No VoIP calls found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedCall && (
        <div style={styles.detailsSection}>
          <h3 style={styles.detailsHeader}>Details for VoIP Call {selectedCall.callId.substring(0, 20)}...</h3>
          <p style={styles.detailItem}><strong>From:</strong> {selectedCall.from}</p>
          <p style={styles.detailItem}><strong>To:</strong> {selectedCall.to}</p>
          <p style={styles.detailItem}><strong>Call ID:</strong> {selectedCall.callId}</p>
          <p style={styles.detailItem}><strong>Start:</strong> {selectedCall.startTime} <strong>End:</strong> {selectedCall.endTime}</p>
          <p style={styles.detailItem}><strong>Duration:</strong> {selectedCall.duration}</p>
          <p style={styles.detailItem}><strong>Status:</strong> {selectedCall.status}</p>
          <p style={styles.detailItem}><strong>Protocol:</strong> {selectedCall.protocol}</p>
          <p style={styles.detailItem}><strong>Source IP:</strong> {selectedCall.sourceIp} <strong>Destination IP:</strong> {selectedCall.destIp}</p>

          <h4 style={{ ...styles.detailsHeader, marginTop: '20px' }}>Quality Metrics:</h4>
          <p style={styles.detailItem}><strong>Packet Loss:</strong> {selectedCall.qualityMetrics.loss}</p>
          <p style={styles.detailItem}><strong>Jitter:</strong> {selectedCall.qualityMetrics.jitter}</p>
          <p style={styles.detailItem}><strong>MOS (Mean Opinion Score):</strong> {selectedCall.qualityMetrics.mos}</p>
          <p style={styles.detailItem}><strong>Notes:</strong> {selectedCall.notes}</p>

          <div style={styles.actionButtons}>
            <button
              onClick={handleAnalyzeSipFlow}
              style={styles.button}
              disabled={!selectedCall.sipFlowId}
            >
              Analyze SIP Flow
            </button>
            <button
              onClick={handlePlayRtpStreams}
              style={styles.button}
              disabled={!selectedCall.rtpStreamId}
            >
              Play Streams
            </button>
            {/* Add more actions here if needed, e.g., "Save Call Data" */}
          </div>
          <button onClick={closeDetails} style={styles.closeButton}>
            Close Details
          </button>
        </div>
      )}
    </div>
  );
};

export default VoipCalls;