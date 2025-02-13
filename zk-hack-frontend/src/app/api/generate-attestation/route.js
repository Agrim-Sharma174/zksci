// // app/api/generate-attestation/route.js
// import { NextResponse } from 'next/server';
// // import { zkVerifySession, ZkVerifyEvents } from 'zkverifyjs';
// // (In a real implementation you would import and use zkverifyjs as in your docs.)

// export async function POST(request) {
//   try {
//     const requestData = await request.json();
//     // requestData contains the private data from the uploaded JSON.
//     // Here you would normally:
//     // 1. Compile the Noir circuit and generate a witness/proof (using noir_wasm, noir_js, and bb.js).
//     // 2. Use zkVerifySession to register the verification key (if needed) and submit the proof.
//     // 3. Wait for attestation confirmation.
//     // For this example, we simulate a delay and return a sample attestation.

//     await new Promise((resolve) => setTimeout(resolve, 3000)); // simulate delay

//     const attestation = {
//       root: "0x6cef03043bcee4a73dab57da62acce08846b520638f197d3ff46e601de5f2245",
//       proof: [
//         "0xfccbdd66cee1f80bfd8daadb49aea89ee6654bdfa5147dda39030cf10f455e6b",
//         "0x56ce32c5272debf35647029ed4e45f648c633b1cdb8713a0b97c11530f6dde5f",
//         "0x5c17f993db937b2941257d0a519373cc067da2e8aad0636553ed41b0fa3d37a1"
//       ],
//       numberOfLeaves: 5,
//       leafIndex: 0,
//       leaf: "0x71cd29aea5abae563446cf2626d7f31532306e829ba287586c2329648ddacee1",
//       attestationId: 43404
//     };

//     return NextResponse.json(attestation, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


//! working but in terminal
// import { NextResponse } from 'next/server';
// import { zkVerifySession, ZkVerifyEvents } from 'zkverifyjs';
// import fs from 'fs';
// import path from 'path';

// export async function POST(request) {
//   try {
//     console.log("Received attestation generation request.");
//     const requestData = await request.json();
//     console.log("Request data:", requestData);

//     // Base directory where proof files are stored
//     const baseDir = path.resolve(process.cwd(), 'src/app/api/generate-attestation');
//     const proofPath = path.join(baseDir, 'proof.hex');
//     const publicPath = path.join(baseDir, 'pub.hex');
//     const vkPath = path.join(baseDir, 'vk.hex');

//     // Check if files exist
//     if (!fs.existsSync(proofPath)) {
//       throw new Error(`Proof file not found: ${proofPath}`);
//     }
//     if (!fs.existsSync(publicPath)) {
//       throw new Error(`Public signals file not found: ${publicPath}`);
//     }
//     if (!fs.existsSync(vkPath)) {
//       throw new Error(`Verification key file not found: ${vkPath}`);
//     }

//     const proof = fs.readFileSync(proofPath, 'utf-8').trim();
//     const publicSignals = fs
//       .readFileSync(publicPath, 'utf-8')
//       .trim()
//       .split("\n")
//       .slice(0, -1);
//     const vk = fs.readFileSync(vkPath, 'utf-8').trim().split("\n")[0];

//     console.log("Proof, public signals and vk read successfully.");
//     console.log("Proof:", proof);
//     console.log("Public signals:", publicSignals);
//     console.log("Verification key:", vk);

//     // Start zkVerify Session
//     console.log("Starting zkVerify session...");
//     const session = await zkVerifySession.start().Testnet().withAccount("often tissue possible gesture girl page stumble tobacco remove link bonus doctor");

//     // Register Verification Key
//     console.log("Registering verification key...");
//     const { events: regEvents } = await session.registerVerificationKey().ultraplonk().execute(vk);
    
//     let verificationKeyHash;
//     await new Promise((resolve, reject) => {
//       regEvents.on(ZkVerifyEvents.Finalized, (eventData) => {
//         verificationKeyHash = eventData.statementHash;
//         console.log('Verification finalized:', eventData);
//         // Save the verification key hash to file
//         fs.writeFileSync(path.join(baseDir, "vkey.json"), JSON.stringify({ hash: verificationKeyHash }, null, 2));
//         resolve();
//       });
//       regEvents.on(ZkVerifyEvents.Error, (error) => {
//         console.error("Verification key registration error:", error);
//         reject(error);
//       });
//     });

//     console.log("Verification key registered with hash:", verificationKeyHash);

//     // Submit the proof and wait for attestation
//     console.log("Submitting proof for verification...");
//     const { events: proofEvents } = await session.verify()
//       .ultraplonk()
//       .waitForPublishedAttestation()
//       .withRegisteredVk()
//       .execute({ proofData: { proof, vk: verificationKeyHash, publicSignals } });

//     // Declare variables to store leafDigest and attestationId (if needed)
//     let savedLeafDigest;
//     let savedAttestationId;
    
//     proofEvents.on(ZkVerifyEvents.IncludedInBlock, (eventData) => {
//       console.log('Transaction included in block:', eventData);
//       savedLeafDigest = eventData.leafDigest;
//       savedAttestationId = eventData.attestationId;
//     });

//     proofEvents.on(ZkVerifyEvents.Finalized, (eventData) => {
//       console.log('Transaction finalized:', eventData);
//     });

//     console.log("Waiting for attestation confirmation...");
//     return new Promise((resolve, reject) => {
//       let attestationResolved = false;
//       proofEvents.on(ZkVerifyEvents.AttestationConfirmed, async (eventData) => {
//         attestationResolved = true;
//         console.log('Attestation Confirmed:', eventData);

//         if (!savedLeafDigest) {
//           const errMsg = 'Leaf digest not available. Ensure proof was included in a block.';
//           console.error(errMsg);
//           return reject(errMsg);
//         }

//         try {
//           const proofDetails = await session.poe(eventData.id, savedLeafDigest);
//           proofDetails.attestationId = eventData.id;
//           fs.writeFileSync(path.join(baseDir, "attestation.json"), JSON.stringify(proofDetails, null, 2));
//           console.log("Proof details retrieved and saved:", proofDetails);
//           resolve(NextResponse.json(proofDetails, { status: 200 }));
//         } catch (error) {
//           console.error("Error retrieving proof details:", error);
//           reject(error);
//         }
//       });

//       proofEvents.on(ZkVerifyEvents.Error, (error) => {
//         if (!attestationResolved) {
//           console.error("Error during attestation confirmation:", error);
//           reject(error);
//         }
//       });

//       // Timeout after 60 seconds if not resolved
//       setTimeout(() => {
//         if (!attestationResolved) {
//           const timeoutError = new Error('Attestation confirmation timeout');
//           console.error(timeoutError);
//           reject(timeoutError);
//         }
//       }, 60000);
//     });
//   } catch (error) {
//     console.error("API route error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';
import { zkVerifySession, ZkVerifyEvents } from 'zkverifyjs';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    console.log("Received attestation generation request.");
    const requestData = await request.json();
    console.log("Request data:", requestData);

    // Base directory where proof files are stored
    const baseDir = path.resolve(process.cwd(), 'src/app/api/generate-attestation');
    const proofPath = path.join(baseDir, 'proof.hex');
    const publicPath = path.join(baseDir, 'pub.hex');
    const vkPath = path.join(baseDir, 'vk.hex');
    const vkeyJsonPath = path.join(baseDir, 'vkey.json');

    // Check if files exist
    if (!fs.existsSync(proofPath)) {
      throw new Error(`Proof file not found: ${proofPath}`);
    }
    if (!fs.existsSync(publicPath)) {
      throw new Error(`Public signals file not found: ${publicPath}`);
    }
    if (!fs.existsSync(vkPath)) {
      throw new Error(`Verification key file not found: ${vkPath}`);
    }

    const proof = fs.readFileSync(proofPath, 'utf-8').trim();
    const publicSignals = fs
      .readFileSync(publicPath, 'utf-8')
      .trim()
      .split("\n")
      .slice(0, -1);
    const vk = fs.readFileSync(vkPath, 'utf-8').trim().split("\n")[0];

    console.log("Proof, public signals and vk read successfully.");
    console.log("Proof:", proof.substring(0, 50) + " ..."); // log first 50 chars for brevity
    console.log("Public signals:", publicSignals);
    console.log("Verification key:", vk);

    // Start zkVerify Session
    console.log("Starting zkVerify session...");
    const session = await zkVerifySession.start().Testnet().withAccount("often tissue possible gesture girl page stumble tobacco remove link bonus doctor");

    // Register Verification Key
    console.log("Registering verification key...");
    let verificationKeyHash;
    const { events: regEvents } = await session.registerVerificationKey().ultraplonk().execute(vk);
    await new Promise((resolve, reject) => {
      regEvents.on(ZkVerifyEvents.Finalized, (eventData) => {
        verificationKeyHash = eventData.statementHash;
        console.log('Verification finalized:', eventData);
        fs.writeFileSync(vkeyJsonPath, JSON.stringify({ hash: verificationKeyHash }, null, 2));
        resolve();
      });
      regEvents.on(ZkVerifyEvents.Error, (error) => {
        // If the error indicates the key is already registered, use the stored key
        if (error.message.includes("Verification key has already been registered")) {
          console.log("Verification key already registered. Using existing key.");
          if (fs.existsSync(vkeyJsonPath)) {
            const stored = JSON.parse(fs.readFileSync(vkeyJsonPath, "utf-8"));
            verificationKeyHash = stored.hash;
            resolve();
          } else {
            console.error("vkey.json not found, but key is reported as registered.");
            reject(error);
          }
        } else {
          console.error("Verification key registration error:", error);
          reject(error);
        }
      });
    });

    console.log("Verification key registered (or already registered) with hash:", verificationKeyHash);

    // Submit the proof and wait for attestation
    console.log("Submitting proof for verification...");
    const { events: proofEvents } = await session.verify()
      .ultraplonk()
      .waitForPublishedAttestation()
      .withRegisteredVk()
      .execute({ proofData: { proof, vk: verificationKeyHash, publicSignals } });

    // Capture events for proof inclusion and finalization
    let savedLeafDigest;
    let savedAttestationId;
    proofEvents.on(ZkVerifyEvents.IncludedInBlock, (eventData) => {
      console.log('Transaction included in block:', eventData);
      savedLeafDigest = eventData.leafDigest;
      savedAttestationId = eventData.attestationId;
    });

    proofEvents.on(ZkVerifyEvents.Finalized, (eventData) => {
      console.log('Transaction finalized:', eventData);
    });

    console.log("Waiting for attestation confirmation...");
    return new Promise((resolve, reject) => {
      let attestationResolved = false;
      proofEvents.on(ZkVerifyEvents.AttestationConfirmed, async (eventData) => {
        attestationResolved = true;
        console.log('Attestation Confirmed:', eventData);

        if (!savedLeafDigest) {
          const errMsg = 'Leaf digest not available. Ensure proof was included in a block.';
          console.error(errMsg);
          return reject(errMsg);
        }

        try {
          const proofDetails = await session.poe(eventData.id, savedLeafDigest);
          proofDetails.attestationId = eventData.id;
          fs.writeFileSync(path.join(baseDir, "attestation.json"), JSON.stringify(proofDetails, null, 2));
          console.log("Proof details retrieved and saved:", proofDetails);
          resolve(NextResponse.json(proofDetails, { status: 200 }));
        } catch (error) {
          console.error("Error retrieving proof details:", error);
          reject(error);
        }
      });

      proofEvents.on(ZkVerifyEvents.Error, (error) => {
        if (!attestationResolved) {
          console.error("Error during attestation confirmation:", error);
          reject(error);
        }
      });

      // Timeout after 60 seconds if not resolved
      setTimeout(() => {
        if (!attestationResolved) {
          const timeoutError = new Error('Attestation confirmation timeout');
          console.error(timeoutError);
          reject(timeoutError);
        }
      }, 60000);
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
