// // app/page.js
// export default function HomePage() {
//   return (
//     <div className="text-center">
//       <h1 className="text-3xl font-bold mb-4">Genomin Attestation Platform</h1>
//       <p className="mb-8">Generate and verify attestations for genomic data.</p>
//       <div className="flex justify-center space-x-4">
//         <a href="/generate" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//           Generate Attestation
//         </a>
//         <a href="/verify" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
//           Verify Attestation
//         </a>
//       </div>
//     </div>
//   );
// }



export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Genomin Attestation Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Secure and verifiable attestations for genomic research data, advancing cancer research through transparent data validation.
        </p>
        <div className="flex justify-center space-x-6">
          <a
            href="/generate"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-900 hover:bg-indigo-800 transition-colors duration-300"
          >
            Generate Attestation
          </a>
          <a
            href="/verify"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 transition-colors duration-300"
          >
            Verify Attestation
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Secure Data Handling</h3>
          <p className="text-gray-600">
            Advanced encryption and secure protocols ensure your genomic data remains protected throughout the attestation process.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Verifiable Integrity</h3>
          <p className="text-gray-600">
            Blockchain-based verification ensures the authenticity and integrity of research data attestations.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Research Compliance</h3>
          <p className="text-gray-600">
            Meets international standards for research data handling and verification in genomic studies.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About Our Platform</h2>
        <p className="text-gray-600 mb-6">
          The Genomin Attestation Platform provides researchers with tools to generate and verify attestations for genomic data, 
          ensuring data integrity in cancer research studies while maintaining the highest standards of security and privacy.
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-indigo-900 rounded-full mr-2"></div>
            <span>Compliant with HIPAA standards</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-indigo-900 rounded-full mr-2"></div>
            <span>End-to-end encryption</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-indigo-900 rounded-full mr-2"></div>
            <span>Blockchain verification</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-indigo-900 rounded-full mr-2"></div>
            <span>Audit trail support</span>
          </div>
        </div>
      </div>
    </div>
  );
}