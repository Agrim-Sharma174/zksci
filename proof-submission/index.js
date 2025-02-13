(async () => {
    require('dotenv').config();  // Load the .env file
    const { zkVerifySession, ZkVerifyEvents } = require("zkverifyjs");
    const fs = require("fs");
    const path = require("path");

    const accountPhrase = process.env.ACCOUNT_PHRASE;

    // Read in the proof and public signals from files
    const proof = fs.readFileSync("../zkHackNoir/proof.hex").toString();
    const publicSignals = fs.readFileSync("../zkHackNoir/pub.hex").toString();

    // Start the zkVerify session on Testnet with your account
    const session = await zkVerifySession.start().Testnet().withAccount(accountPhrase);

    // Check if vkey.json already exists
    let vkeyHash;
    const vkeyPath = path.join(__dirname, "vkey.json");
    if (fs.existsSync(vkeyPath)) {
        console.log("vkey.json already exists. Skipping verification key registration.");
        const vkey = require(vkeyPath);
        vkeyHash = vkey.hash;
    } else {
        // Read the verification key file
        let vk = fs.readFileSync("../zkHackNoir/vk.hex").toString();

        // Register the verification key and get the events for that registration
        const { events: regEvents, regResult } = await session
            .registerVerificationKey()
            .ultraplonk()
            .execute(vk.split("\n")[0]);

        // Wait for registration finalization using Promise
        vkeyHash = await new Promise((resolve, reject) => {
            regEvents.on(ZkVerifyEvents.Finalized, (eventData) => {
                console.log('Verification finalized:', eventData);
                const hash = eventData.statementHash;
                fs.writeFileSync(vkeyPath, JSON.stringify({ hash }, null, 2));
                resolve(hash);
            });
            
            regEvents.on(ZkVerifyEvents.Error, (error) => {
                reject(error);
            });
        });
    }

    // Now load the vkey after it's been created or already exists
    const vkey = require(vkeyPath);

    // Submit the proof for verification
    const { events: verifyEvents, txResults } = await session
        .verify()
        .ultraplonk()
        .waitForPublishedAttestation()
        .withRegisteredVk()
        .execute({
            proofData: {
                proof: proof.split("\n")[0],
                vk: vkey.hash,
                publicSignals: publicSignals.split("\n").slice(0, -1),
            }
        });

    // Declare variables to store leafDigest and attestationId
    let savedLeafDigest;
    let savedAttestationId;

    // Listen for the transaction being included in a block
    verifyEvents.on(ZkVerifyEvents.IncludedInBlock, (eventData) => {
        console.log('Transaction included in block:', eventData);
        savedLeafDigest = eventData.leafDigest; // Capture leafDigest here
        savedAttestationId = eventData.attestationId;
    });

    // Listen for the finalization event
    verifyEvents.on(ZkVerifyEvents.Finalized, (eventData) => {
        console.log('Transaction finalized:', eventData);
    });

    // Create a promise to wait for attestation confirmation
    const attestationConfirmation = new Promise((resolve, reject) => {
        let attestationResolved = false;

        verifyEvents.on(ZkVerifyEvents.AttestationConfirmed, async (eventData) => {
            attestationResolved = true;
            console.log('Attestation Confirmed', eventData);

            if (!savedLeafDigest) {
                reject('Leaf digest not available. Ensure proof was included in a block.');
                return;
            }

            try {
                const proofDetails = await session.poe(eventData.id, savedLeafDigest);
                proofDetails.attestationId = eventData.id;
                fs.writeFileSync("attestation.json", JSON.stringify(proofDetails, null, 2));
                resolve(proofDetails);
            } catch (error) {
                reject(error);
            }
        });

        verifyEvents.on(ZkVerifyEvents.Error, (error) => {
            if (!attestationResolved) {
                reject(error);
            }
        });

        // Add timeout if needed
        setTimeout(() => {
            if (!attestationResolved) {
                reject(new Error('Attestation confirmation timeout'));
            }
        }, 60000); // 60 seconds timeout
    });

    // Wait for attestation confirmation
    try {
        const proofDetails = await attestationConfirmation;
        console.log("Proof details:", proofDetails);
    } catch (error) {
        console.error("Error during attestation confirmation:", error);
    }
})();