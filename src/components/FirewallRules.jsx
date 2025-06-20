import React, { useState } from 'react';

const FirewallRules = () => {
  const [rules, setRules] = useState([
    { id: 1, source: '192.168.1.10', destination: '8.8.8.8', action: 'ALLOW' },
    { id: 2, source: '192.168.1.15', destination: '1.1.1.1', action: 'DENY' },
  ]);
  const [form, setForm] = useState({ source: '', destination: '', action: 'ALLOW' });
  const [copyAllStatus, setCopyAllStatus] = useState('Copy All Rules');
  const [copyStatusById, setCopyStatusById] = useState({});

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const addRule = () => {
    if (form.source && form.destination) {
      setRules([...rules, { id: Date.now(), ...form }]);
      setForm({ source: '', destination: '', action: 'ALLOW' });
    } else alert('Please fill all fields.');
  };

  const deleteRule = id => setRules(rules.filter(r => r.id !== id));

  const formatRuleToIPFW = rule => {
    const action = rule.action.toLowerCase();
    const source = rule.source.trim() || 'any';
    const destination = rule.destination.trim() || 'any';
    return `add ${action} ip from ${source} to ${destination} in`;
  };

  const copyText = async (text, setStatusCallback, key) => {
    try {
      await navigator.clipboard.writeText(text); // ✅ modern Clipboard API :contentReference[oaicite:3]{index=3}
      setStatusCallback(prev =>
        typeof prev === 'object'
          ? { ...prev, [key]: 'Copied!' }
          : 'Copied!'
      );
      setTimeout(
        () =>
          setStatusCallback(prev =>
            typeof prev === 'object'
              ? { ...prev, [key]: 'Copy Rule' }
              : 'Copy All Rules'
          ),
        2000
      );
    } catch (err) {
      console.error('Copy failed', err);
      setStatusCallback(prev =>
        typeof prev === 'object'
          ? { ...prev, [key]: 'Failed' }
          : 'Failed to Copy'
      );
      setTimeout(
        () => setStatusCallback('Copy All Rules'),
        2000
      );
    }
  };

  const copyAllRules = () => {
    const allText = rules.map(formatRuleToIPFW).join('\n');
    copyText(allText, setCopyAllStatus, null);
  };

  const copyRule = id => {
    const rule = rules.find(r => r.id === id);
    copyText(formatRuleToIPFW(rule), setCopyStatusById, id);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#1e1e2f', color: '#cfd8dc', fontFamily: 'monospace' }}>
      <h2 style={{ color: '#00ff99' }}>Firewall ACL Rules</h2>

      {/* Add New Rule section */}
      <div style={{ marginBottom: '20px', backgroundColor: '#2c2c44', padding: '15px', borderRadius: '8px' }}>
        <h4 style={{ color: '#00ffff' }}>Add New Rule</h4>
        <input name="source" placeholder="Source IP" value={form.source} onChange={handleChange} style={inputStyle} />
        <input name="destination" placeholder="Destination IP" value={form.destination} onChange={handleChange} style={inputStyle} />
        <select name="action" value={form.action} onChange={handleChange} style={inputStyle}>
          <option value="ALLOW">ALLOW</option>
          <option value="DENY">DENY</option>
        </select>
        <button onClick={addRule} style={addBtnStyle}>Add Rule</button>
      </div>

      {/* Current Rules table */}
      <h4 style={{ color: '#00ffff' }}>Current Rules</h4>
      <table style={tableStyle}>
        <thead><tr style={{ backgroundColor: '#003344' }}>
          <th>ID</th><th>Source</th><th>Destination</th><th>Action</th><th>Copy</th><th>Delete</th>
        </tr></thead>
        <tbody>
          {rules.length === 0 ? (
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No rules found.</td></tr>
          ) : (
            rules.map(rule => (
              <tr key={rule.id}>
                <td>{rule.id}</td>
                <td>{rule.source}</td>
                <td>{rule.destination}</td>
                <td>{rule.action}</td>
                <td>
                  <button onClick={() => copyRule(rule.id)} style={copyBtnStyle}>
                    {copyStatusById[rule.id] || 'Copy Rule'}
                  </button>
                </td>
                <td>
                  <button onClick={() => deleteRule(rule.id)} style={delBtnStyle}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Copy All and CLI view */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={copyAllRules} style={addBtnStyle}>{copyAllStatus}</button>
      </div>
      <div style={cliBoxStyle}>
        <h4 style={{ color: '#00ff99' }}>Firewall Rules (ipfw CLI format)</h4>
        <pre style={cliPreStyle}>
          {rules.length === 0 ? 'No rules to display.' : rules.map(formatRuleToIPFW).join('\n')}
        </pre>
      </div>
    </div>
  );
};

// Styles
const inputStyle = { marginRight: '10px', padding: '5px', borderRadius: '4px', border: 'none' };
const addBtnStyle = { backgroundColor: '#00ff99', border: 'none', padding: '7px 15px', borderRadius: '5px', cursor: 'pointer', color: '#000', fontWeight: 'bold', marginRight: '10px', marginTop: '10px' };
const copyBtnStyle = { backgroundColor: '#0066cc', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', color: '#fff', fontWeight: 'bold' };
const delBtnStyle = { backgroundColor: '#ff4d4d', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', color: '#fff', fontWeight: 'bold' };
const tableStyle = { width: '100%', backgroundColor: '#2c2c44', borderCollapse: 'collapse', color: '#cfd8dc', cellPadding: 8, cellSpacing: 0 };
const cliBoxStyle = { marginTop: '30px', backgroundColor: '#12121b', padding: '20px', borderRadius: '8px' };
const cliPreStyle = { backgroundColor: '#000', color: '#00ff00', padding: '15px', borderRadius: '6px', maxHeight: '300px', overflowY: 'auto', fontSize: '14px' };

export default FirewallRules;
