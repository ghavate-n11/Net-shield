import React from 'react';

const LogList = () => {
  // You can later fetch this data from an API
  const logs = [
    { id: 1, time: '10:15:32', message: 'TCP Packet received from 192.168.1.5' },
    { id: 2, time: '10:16:02', message: 'UDP Packet sent to 10.0.0.5' },
  ];

  return (
    <div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {logs.map(log => (
          <li key={log.id} style={{
            padding: '0.5rem',
            borderBottom: '1px solid #ccc',
            fontFamily: 'monospace'
          }}>
            <strong>{log.time}</strong>: {log.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LogList;
