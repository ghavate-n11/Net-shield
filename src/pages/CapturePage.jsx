import React, { useState } from "react";

const NmapScan = () => {
  const [target, setTarget] = useState("192.168.1.0/24");
  const [scanResults, setScanResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const runScan = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/nmap/scan?target=${target}`);
      const data = await response.json(); // expects JSON array of strings
      setScanResults(data);
    } catch (err) {
      setScanResults(["Error fetching scan results."]);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Live Network Scan with Nmap</h2>
      <input
        type="text"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="Enter target subnet or IP"
      />
      <button onClick={runScan} disabled={loading}>
        {loading ? "Scanning..." : "Start Scan"}
      </button>
      <pre style={{ whiteSpace: "pre-wrap", marginTop: "1em" }}>
        {scanResults.join("\n")}
      </pre>
    </div>
  );
};

export default NmapScan;
