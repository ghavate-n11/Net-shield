// src/components/FirewallRules.jsx
import React, { useState } from 'react';

const FirewallRules = () => {
  const [rules, setRules] = useState([
    { id: 1, source: '192.168.1.10', destination: '8.8.8.8', action: 'ALLOW' },
    { id: 2, source: '192.168.1.15', destination: '1.1.1.1', action: 'DENY' },
  ]);

  const [form, setForm] = useState({
    source: '',
    destination: '',
    action: 'ALLOW',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addRule = () => {
    if (form.source && form.destination) {
      const newRule = {
        id: Date.now(), // Unique ID for each rule
        ...form,
      };
      setRules([...rules, newRule]);
      setForm({ source: '', destination: '', action: 'ALLOW' }); // Reset form
    } else {
      alert('Please fill all fields.');
    }
  };

  const deleteRule = (id) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  // Helper to convert rule to ipfw CLI format string
  const formatRuleToIPFW = (rule) => {
    const action = rule.action.toLowerCase();
    const source = rule.source.trim() === '' ? 'any' : rule.source.trim();
    const destination = rule.destination.trim() === '' ? 'any' : rule.destination.trim();
    return `add ${action} ip from ${source} to ${destination} in`;
  };

  // Inline styles for a dark, console-like theme
  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#1e1e2f',
      color: '#cfd8dc',
      fontFamily: 'monospace',
      minHeight: '100vh',
      boxSizing: 'border-box',
    },
    header: {
      color: '#00ff99',
      marginBottom: '20px',
      borderBottom: '1px solid #005533',
      paddingBottom: '10px',
    },
    sectionTitle: {
      color: '#00ffff',
      marginBottom: '15px',
    },
    inputGroup: {
      marginBottom: '20px',
      backgroundColor: '#2c2c44',
      padding: '15px',
      borderRadius: '8px',
    },
    input: {
      marginRight: '10px',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #4a4a60',
      backgroundColor: '#3c3c55',
      color: '#cfd8dc',
      outline: 'none',
    },
    select: {
      marginRight: '10px',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #4a4a60',
      backgroundColor: '#3c3c55',
      color: '#cfd8dc',
      outline: 'none',
    },
    button: {
      backgroundColor: '#00ff99',
      border: 'none',
      padding: '7px 15px',
      borderRadius: '5px',
      cursor: 'pointer',
      color: '#000',
      fontWeight: 'bold',
      transition: 'background-color 0.2s ease',
    },
    buttonHover: {
      backgroundColor: '#00cc77',
    },
    deleteButton: {
      backgroundColor: '#ff4d4d',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '4px',
      cursor: 'pointer',
      color: '#fff',
      fontWeight: 'bold',
      transition: 'background-color 0.2s ease',
    },
    deleteButtonHover: {
      backgroundColor: '#cc3d3d',
    },
    table: {
      width: '100%',
      backgroundColor: '#2c2c44',
      borderCollapse: 'collapse',
      color: '#cfd8dc',
      marginBottom: '20px',
    },
    th: {
      backgroundColor: '#003344',
      padding: '10px',
      textAlign: 'left',
      border: '1px solid #004455',
    },
    td: {
      padding: '10px',
      border: '1px solid #3c3c55',
    },
    noRules: {
      textAlign: 'center',
      padding: '15px',
      color: '#aaa',
      fontStyle: 'italic',
    },
    cliOutput: {
      marginTop: '30px',
      backgroundColor: '#12121b',
      padding: '20px',
      borderRadius: '8px',
    },
    pre: {
      backgroundColor: '#000',
      color: '#00ff00',
      padding: '15px',
      borderRadius: '6px',
      maxHeight: '300px',
      overflowY: 'auto',
      fontSize: '14px',
      whiteSpace: 'pre-wrap', // Allows long lines to wrap
      wordBreak: 'break-all',  // Breaks words if necessary
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Firewall ACL Rules</h2>

      <div style={styles.inputGroup}>
        <h4 style={styles.sectionTitle}>Add New Rule</h4>
        <input
          type="text"
          name="source"
          placeholder="Source IP"
          value={form.source}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination IP"
          value={form.destination}
          onChange={handleChange}
          style={styles.input}
        />
        <select
          name="action"
          value={form.action}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="ALLOW">ALLOW</option>
          <option value="DENY">DENY</option>
        </select>
        <button
          onClick={addRule}
          style={styles.button}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
        >
          Add Rule
        </button>
      </div>

      <h4 style={styles.sectionTitle}>Current Rules</h4>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Source</th>
            <th style={styles.th}>Destination</th>
            <th style={styles.th}>Action</th>
            <th style={styles.th}>Delete</th>
          </tr>
        </thead>
        <tbody>
          {rules.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.noRules}>
                No rules found.
              </td>
            </tr>
          ) : (
            rules.map((rule) => (
              <tr key={rule.id}>
                <td style={styles.td}>{rule.id}</td>
                <td style={styles.td}>{rule.source}</td>
                <td style={styles.td}>{rule.destination}</td>
                <td style={styles.td}>{rule.action}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    style={styles.deleteButton}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.deleteButtonHover.backgroundColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.deleteButton.backgroundColor)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={styles.cliOutput}>
        <h4 style={styles.sectionTitle}>Firewall Rules (ipfw CLI format)</h4>
        <pre style={styles.pre}>
          {rules.length === 0
            ? 'No rules to display.'
            : rules.map((rule) => formatRuleToIPFW(rule)).join('\n')}
        </pre>
      </div>
    </div>
  );
};

export default FirewallRules;