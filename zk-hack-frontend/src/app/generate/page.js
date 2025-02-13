'use client';
import { useState } from 'react';

export default function GeneratePage() {
  const [attestation, setAttestation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    setLogs(prev => [...prev, msg]);
    console.log(msg);
  };

  const handleGenerate = async () => {
    setLoading(true);
    addLog("Starting attestation generation...");

    try {
      const response = await fetch('/api/generate-attestation', {
        method: 'POST'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Attestation generation failed");
      }

      const result = await response.json();
      setAttestation(result);
      addLog("Attestation generated successfully!");
    } catch (err) {
      addLog(`Error: ${err.message}`);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadAttestation = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(attestation, null, 2)], {
      type: "application/json"
    });
    element.href = URL.createObjectURL(file);
    element.download = "attestation.json";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 text-black">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Generate Attestation</h1>

        <button
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Attestation'}
        </button>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Process Logs</h2>
          <div className="h-32 overflow-y-auto bg-white p-3 rounded-md">
            {logs.map((log, i) => (
              <div key={i} className={`text-sm ${log.startsWith('Error') ? 'text-red-600' : 'text-gray-600'}`}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {attestation && (
        <div className="bg-green-50 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Attestation Ready</h2>
          <button
            onClick={downloadAttestation}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Download Attestation
          </button>
        </div>
      )}
    </div>
  );
}
