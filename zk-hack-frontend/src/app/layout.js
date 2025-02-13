// // app/layout.js
// 'use client';
// import Link from 'next/link';

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <head>
//         <title>Genomin Attestation Platform</title>
//       </head>
//       <body className="bg-gray-100">
//         <nav className="bg-blue-600 p-4 text-white flex space-x-4">
//           <Link href="/">Home</Link>
//           <Link href="/generate">Generate Attestation</Link>
//           <Link href="/verify">Verify Attestation</Link>
//         </nav>
//         <main className="p-8">
//           {children}
//         </main>
//       </body>
//     </html>
//   );
// }


'use client';
import Link from 'next/link';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Genomin Attestation Platform</title>
        <meta name="description" content="Secure genomic data attestation platform for cancer research" />
      </head>
      <body className="min-h-screen bg-gray-50">
        <nav className="bg-gradient-to-r from-indigo-900 to-blue-900 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-white font-semibold text-xl">
                  Genomin Platform
                </Link>
              </div>
              <div className="flex space-x-6">
                <Link href="/" className="text-gray-100 hover:text-white hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Home
                </Link>
                <Link href="/generate" className="text-gray-100 hover:text-white hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Generate Attestation
                </Link>
                <Link href="/verify" className="text-gray-100 hover:text-white hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Verify Attestation
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="bg-gray-100 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-gray-600 text-sm">
              © 2025 Genomin Attestation Platform. Advancing cancer research through secure data attestation.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}