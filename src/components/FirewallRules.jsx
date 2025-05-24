// src/pages/FirewallRules.jsx
import React from 'react';

const FirewallRules = () => {
  const rules = `# IPFirewall (ipfw) rules for wireshark_Wi-Fi2D7B72.pcapng, packet 11642.

# IPv4 source address.
add deny ip from 172.18.9.252 to any in

# IPv4 destination address.
add deny ip from 180.149.61.77 to any in

# Source port.
add deny udp from any to any 53001 in

# Destination port.
add deny udp from any to any 443 in

# IPv4 source address and port.
add deny udp from 172.18.9.252 53001 to any in

# IPv4 destination address and port.
add deny udp from 180.149.61.77 443 to any in

# MAC source address.
add deny MAC 30:03:c8:88:8f:6f any in

# MAC destination address.
add deny MAC 48:df:37:b0:31:c9 any in`;

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f8f9fa', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
      <h2>Firewall ACL Rules</h2>
      <pre>{rules}</pre>
    </div>
  );
};

export default FirewallRules;
