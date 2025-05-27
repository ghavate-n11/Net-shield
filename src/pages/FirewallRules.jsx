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
        id: Date.now(),
        ...form,
      };
      setRules([...rules, newRule]);
      setForm({ source: '', destination: '', action: 'ALLOW' });
    } else {
      alert('Please fill all fields.');
    }
  };

  const deleteRule = (id) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  // Helper to convert rule to ipfw CLI format string
  const formatRuleToIPFW = (rule) => {
    // We map ALLOW -> allow, DENY -> deny (lowercase)
    const action = rule.action.toLowerCase();
    // For simplicity, we'll assume protocol is ip
    // We'll also handle 'any' IPs (if source or destination is empty or 'any')
    const source = rule.source.trim() === '' ? 'any' : rule.source.trim();
    const destination = rule.destination.trim() === '' ? 'any' : rule.destination.trim();

    return `add ${action} ip from ${source} to ${destination} in`;
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#1e1e2f', color: '#cfd8dc', fontFamily: 'monospace' }}>
      <h2 style={{ color: '#00ff99' }}>Firewall ACL Rules</h2>

      <div style={{ marginBottom: '20px', backgroundColor: '#2c2c44', padding: '15px', borderRadius: '8px' }}>
        <h4 style={{ color: '#00ffff' }}>Add New Rule</h4>
        <input
          type="text"
          name="source"
          placeholder="Source IP"
          value={form.source}
          onChange={handleChange}
          style={{ marginRight: '10px', padding: '5px', borderRadius: '4px', border: 'none' }}
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination IP"
          value={form.destination}
          onChange={handleChange}
          style={{ marginRight: '10px', padding: '5px', borderRadius: '4px', border: 'none' }}
        />
        <select
          name="action"
          value={form.action}
          onChange={handleChange}
          style={{ marginRight: '10px', padding: '5px', borderRadius: '4px', border: 'none' }}
        >
          <option value="ALLOW">ALLOW</option>
          <option value="DENY">DENY</option>
        </select>
        <button
          onClick={addRule}
          style={{
            backgroundColor: '#00ff99',
            border: 'none',
            padding: '7px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            color: '#000',
            fontWeight: 'bold',
          }}
        >
          Add Rule
        </button>
      </div>

      <h4 style={{ color: '#00ffff' }}>Current Rules</h4>
      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{ width: '100%', backgroundColor: '#2c2c44', borderCollapse: 'collapse', color: '#cfd8dc' }}
      >
        <thead>
          <tr style={{ backgroundColor: '#003344' }}>
            <th>ID</th>
            <th>Source</th>
            <th>Destination</th>
            <th>Action</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {rules.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                No rules found.
              </td>
            </tr>
          ) : (
            rules.map((rule) => (
              <tr key={rule.id}>
                <td>{rule.id}</td>
                <td>{rule.source}</td>
                <td>{rule.destination}</td>
                <td>{rule.action}</td>
                <td>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    style={{
                      backgroundColor: '#ff4d4d',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      color: '#fff',
                      fontWeight: 'bold',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* New section to show rules in CLI format */}
      <div style={{ marginTop: '30px', backgroundColor: '#12121b', padding: '20px', borderRadius: '8px' }}>
        <h4 style={{ color: '#00ff99' }}>Firewall Rules (ipfw CLI format)</h4>
        <pre
          style={{
            backgroundColor: '#000',
            color: '#00ff00',
            padding: '15px',
            borderRadius: '6px',
            maxHeight: '300px',
            overflowY: 'auto',
            fontSize: '14px',
          }}
        >
          {rules.length === 0
            ? 'No rules to display.'
            : rules.map((rule) => formatRuleToIPFW(rule)).join('\n')}
        </pre>
      </div>
    </div>
  );
};

export default FirewallRules;