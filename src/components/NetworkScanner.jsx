import React, { useState } from "react";
import axios from "axios";

function NetworkScanner() {
    const [ip, setIp] = useState("127.0.0.1");
    const [output, setOutput] = useState("");

    const handleScan = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/network/scan?ip=${ip}`);
            setOutput(response.data);
        } catch (error) {
            setOutput("Error fetching data");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-2">NetShield – Network Scanner</h1>
            <input
                type="text"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                className="border p-2 mr-2"
                placeholder="Enter IP address"
            />
            <button onClick={handleScan} className="bg-blue-500 text-white px-4 py-2">Scan</button>

            <pre className="bg-gray-100 p-4 mt-4 whitespace-pre-wrap">{output}</pre>
        </div>
    );
}

