import React, { useEffect, useState } from 'react';

function LogList() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/logs')
      .then(response => response.json())
      .then(data => setLogs(data))
      .catch(error => console.error('Error fetching logs:', error));
  }, []);

  return (
    <div>
      <h2>Network Logs</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>IP Address</th>
            <th>Protocol</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.ipAddress}</td>
              <td>{log.protocol}</td>
              <td>{log.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LogList;
