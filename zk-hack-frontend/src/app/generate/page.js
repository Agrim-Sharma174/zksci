// 'use client';
// import { useState } from 'react';

// export default function GeneratePage() {
//   const [fileContent, setFileContent] = useState(null);
//   const [attestation, setAttestation] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [logs, setLogs] = useState([]);

//   const addLog = (msg) => {
//     console.log(msg);
//     setLogs((prev) => [...prev, msg]);
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       try {
//         const json = JSON.parse(event.target.result);
//         setFileContent(json);
//         addLog("Private JSON loaded successfully.");
//       } catch (err) {
//         alert("Invalid JSON file.");
//       }
//     };
//     reader.readAsText(file);
//   };

//   const handleGenerate = async () => {
//     if (!fileContent) {
//       alert("Please upload a valid JSON file.");
//       return;
//     }
//     setLoading(true);
//     addLog("Starting attestation generation...");
//     try {
//       const response = await fetch('/api/generate-attestation', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(fileContent)
//       });
//       if (!response.ok) {
//         throw new Error("Failed to generate attestation.");
//       }
//       const data = await response.json();
//       setAttestation(data);
//       addLog("Attestation generated successfully.");
//     } catch (err) {
//       console.error(err);
//       addLog("Error: " + err.message);
//       alert(err.message);
//     }
//     setLoading(false);
//   };

//   const downloadAttestation = () => {
//     const element = document.createElement("a");
//     const file = new Blob([JSON.stringify(attestation, null, 2)], { type: "application/json" });
//     element.href = URL.createObjectURL(file);
//     element.download = "attestation.json";
//     document.body.appendChild(element);
//     element.click();
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Generate Attestation</h1>
//       <div className="mb-4">
//         <label className="block mb-2 font-semibold">Upload Private Data JSON</label>
//         <input type="file" accept=".json" onChange={handleFileChange} className="border p-2" />
//       </div>
//       <button 
//         onClick={handleGenerate} 
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         disabled={loading}
//       >
//         {loading ? "Generating..." : "Generate Attestation"}
//       </button>
//       <div className="mt-4">
//         <h2 className="font-semibold">Logs:</h2>
//         <div className="bg-gray-100 p-2 rounded h-32 overflow-auto text-sm">
//           {logs.map((log, index) => (
//             <div key={index}>{log}</div>
//           ))}
//         </div>
//       </div>
//       {attestation && (
//         <div className="mt-6 p-4 bg-white rounded shadow">
//           <h2 className="font-bold mb-2">Attestation Generated:</h2>
//           <pre className="text-sm overflow-auto">{JSON.stringify(attestation, null, 2)}</pre>
//           <button 
//             onClick={downloadAttestation} 
//             className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//           >
//             Download Attestation JSON
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }



'use client';
import { useState } from 'react';

export default function GeneratePage() {
  const [fileContent, setFileContent] = useState(null);
  const [attestation, setAttestation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    console.log(msg);
    setLogs((prev) => [...prev, msg]);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        setFileContent(json);
        addLog("Private JSON loaded successfully.");
      } catch (err) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  // const handleGenerate = async () => {
  //   if (!fileContent) {
  //     alert("Please upload a valid JSON file.");
  //     return;
  //   }
  //   setLoading(true);
  //   addLog("Starting attestation generation...");
  //   try {
  //     const response = await fetch('/api/generate-attestation', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(fileContent)
  //     });
  //     if (!response.ok) {
  //       throw new Error("Failed to generate attestation.");
  //     }
  //     const data = await response.json();
  //     setAttestation(data);
  //     addLog("Attestation generated successfully.");
  //   } catch (err) {
  //     console.error(err);
  //     addLog("Error: " + err.message);
  //     alert(err.message);
  //   }
  //   setLoading(false);
  // };

  const handleGenerate = async () => {
    if (!fileContent) {
      alert("Please upload a valid JSON file.");
      return;
    }
    setLoading(true);
    addLog("Starting attestation generation...");
    try {
      const response = await fetch('/api/generate-attestation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fileContent)
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle server-side errors with detailed messages
        throw new Error(data.error || "Failed to generate attestation");
      }

      setAttestation(data);
      addLog("Attestation generated successfully.");
    } catch (err) {
      console.error(err);
      // Handle network errors and server errors consistently
      const errorMessage = err.message || "Unknown error occurred";
      addLog(`Error: ${errorMessage}`);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const downloadAttestation = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(attestation, null, 2)], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = "attestation.json";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Generate Attestation</h1>
          <p className="mt-2 text-gray-600">Generate secure attestations for genomic variants and research data</p>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Genomic Data</h2>
            <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 bg-white">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Private Genomic Data JSON
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              {fileContent && (
                <div className="mt-4 bg-gray-50 rounded-md p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Loaded Data Preview:</h3>
                  <pre className="text-xs text-gray-600 overflow-auto max-h-40">{JSON.stringify(fileContent, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !fileContent}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Attestation...
              </span>
            ) : "Generate Attestation"}
          </button>

          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Process Logs
            </h2>
            {/* // Update the log rendering to highlight errors */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 h-32 overflow-auto font-mono">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`text-sm py-1 ${log.startsWith('Error:') ? 'text-red-600' : 'text-gray-600'
                    }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {attestation && (
        <div className="mt-8 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
            Attestation Generated Successfully
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Attestation ID</span>
                  <p className="text-lg font-mono text-gray-900">{attestation.attestationId}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Leaf Index</span>
                  <p className="text-lg font-mono text-gray-900">{attestation.leafIndex}</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <span className="text-sm font-medium text-gray-500 block mb-2">Merkle Root</span>
                <p className="font-mono text-sm text-gray-900 break-all">{attestation.root}</p>
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <span className="text-sm font-medium text-gray-500 block mb-2">Proof Elements</span>
                <div className="space-y-2">
                  {attestation.proof.map((proof, index) => (
                    <p key={index} className="font-mono text-sm text-gray-900 break-all">{proof}</p>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={downloadAttestation}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Download Attestation JSON
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Important Information</h2>
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2"></span>
            <span>Ensure your genomic data JSON follows the required format for chromosome, position, and allele information</span>
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2"></span>
            <span>The generated attestation contains cryptographic proofs that can be verified on-chain</span>
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2"></span>
            <span>Store the downloaded attestation file securely - it will be required for verification</span>
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2"></span>
            <span>Use the verification page to validate the attestation's authenticity on the blockchain</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
