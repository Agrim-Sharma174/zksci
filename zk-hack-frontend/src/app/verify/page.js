// 'use client';
// import { useState } from 'react';
// import { ethers } from 'ethers';

// export default function VerifyPage() {
//   const [attestationData, setAttestationData] = useState(null);
//   const [walletAddress, setWalletAddress] = useState(null);
//   const [txStatus, setTxStatus] = useState(null);
//   const [contractAddress, setContractAddress] = useState(""); // User-supplied contract address

//   // Minimal ABI for contract verification
//   const contractABI = [
//     "function checkHash(bytes32 _hash, uint256 _attestationId, bytes32[] calldata _merklePath, uint256 _leafCount, uint256 _index) public"
//   ];

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       try {
//         const json = JSON.parse(event.target.result);
//         setAttestationData(json);
//       } catch (err) {
//         alert("Invalid JSON file.");
//       }
//     };
//     reader.readAsText(file);
//   };

//   const connectWallet = async () => {
//     if (typeof window.ethereum === 'undefined') {
//       alert("Please install MetaMask.");
//       return;
//     }
//     try {
//       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//       setWalletAddress(accounts[0]);
//     } catch (err) {
//       console.error(err);
//       alert("Wallet connection failed.");
//     }
//   };

//   const verifyAttestation = async () => {
//     if (!walletAddress || !attestationData || !contractAddress) {
//       alert("Please connect wallet, upload attestation, and enter contract address.");
//       return;
//     }

//     try {
//       const provider = new ethers.providers.Web3Provider(window.ethereum); // Using Web3Provider to interact with the Ethereum provider
//       const signer = await provider.getSigner();
//       const contract = new ethers.Contract(contractAddress, contractABI, signer);

//       const tx = await contract.checkHash(
//         attestationData.leaf,
//         attestationData.attestationId,
//         attestationData.proof,
//         attestationData.numberOfLeaves,
//         attestationData.leafIndex
//       );

//       setTxStatus("Transaction Sent: " + tx.hash);
//       await tx.wait();
//       setTxStatus("Attestation Verified!");
//     } catch (err) {
//       console.error(err);
//       setTxStatus("Verification Failed: " + err.message);
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Verify Attestation</h1>

//       <button onClick={connectWallet} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
//         {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...` : "Connect Wallet"}
//       </button>

//       <input
//         type="file"
//         accept=".json"
//         onChange={handleFileChange}
//         className="block border p-2 mb-4"
//       />

//       <input
//         type="text"
//         placeholder="Enter contract address"
//         value={contractAddress}
//         onChange={(e) => setContractAddress(e.target.value)}
//         className="block border p-2 mb-4 w-full"
//       />

//       <button onClick={verifyAttestation} className="bg-green-500 text-white px-4 py-2 rounded">
//         Verify Attestation
//       </button>

//       {txStatus && <p className="mt-4">{txStatus}</p>}
//     </div>
//   );
// }


'use client';
import { useState } from 'react';
import { ethers } from 'ethers';

export default function VerifyPage() {
  const [attestationData, setAttestationData] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [txStatus, setTxStatus] = useState(null);
  const [contractAddress, setContractAddress] = useState("");

  const contractABI = [
    "function checkHash(bytes32 _hash, uint256 _attestationId, bytes32[] calldata _merklePath, uint256 _leafCount, uint256 _index) public"
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        setAttestationData(json);
      } catch (err) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert("Please install MetaMask.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
    } catch (err) {
      console.error(err);
      alert("Wallet connection failed.");
    }
  };

  const verifyAttestation = async () => {
    if (!walletAddress || !attestationData || !contractAddress) {
      alert("Please connect wallet, upload attestation, and enter contract address.");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.checkHash(
        attestationData.leaf,
        attestationData.attestationId,
        attestationData.proof,
        attestationData.numberOfLeaves,
        attestationData.leafIndex
      );

      setTxStatus("Transaction Sent: " + tx.hash);
      await tx.wait();
      setTxStatus("Attestation Verified!");
    } catch (err) {
      console.error(err);
      setTxStatus("Verification Failed: " + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Verify Attestation</h1>
          <p className="mt-2 text-gray-600">Verify the authenticity of genomic data attestations on the blockchain</p>
        </div>
        
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
            <button 
              onClick={connectWallet} 
              className="w-full bg-gradient-to-r from-purple-900 to-blue-900 hover:from-purple-800 hover:to-blue-800 text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
            </button>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <div className="space-y-6">
              <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 bg-white">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Attestation JSON
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              {attestationData && (
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Attestation Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-500">ID:</span>
                        <span className="ml-2 font-mono">{attestationData.attestationId}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Leaf Index:</span>
                        <span className="ml-2 font-mono">{attestationData.leafIndex}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Root:</span>
                      <span className="ml-2 font-mono break-all text-xs">{attestationData.root}</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Smart Contract Address
                </label>
                <input
                  type="text"
                  placeholder="Enter the verification contract address"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={verifyAttestation}
            disabled={!walletAddress || !attestationData || !contractAddress}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            Verify Attestation
          </button>

          {txStatus && (
            <div className={`rounded-lg p-4 ${
              txStatus.includes("Failed") 
                ? "bg-red-50 text-red-900 border border-red-200" 
                : txStatus.includes("Verified") 
                  ? "bg-green-50 text-green-900 border border-green-200"
                  : "bg-blue-50 text-blue-900 border border-blue-200"
            }`}>
              <div className="flex items-center">
                {txStatus.includes("Failed") ? (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : txStatus.includes("Verified") ? (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                {txStatus}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-gray-50 rounded-xl p-8 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Verification Process Guide</h2>
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-semibold">1</div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Connect Wallet</h3>
              <p className="mt-1 text-gray-600">Connect your Ethereum wallet using MetaMask or another Web3 provider</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-semibold">2</div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Upload Attestation</h3>
              <p className="mt-1 text-gray-600">Upload the attestation JSON file received from the generation process</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-semibold">3</div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Enter Contract Address</h3>
              <p className="mt-1 text-gray-600">Provide the verification smart contract address</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-semibold">4</div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Verify</h3>
              <p className="mt-1 text-gray-600">Click verify and confirm the transaction in your wallet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}