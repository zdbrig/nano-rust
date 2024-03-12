const fs = require('fs');
const { Connection, PublicKey, clusterApiUrl, Keypair, SystemProgram, Transaction, TransactionInstruction } = require('@solana/web3.js');
const bs58 = require('bs58');



async function main() {
    const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
    const nanoscriptFilePath = 'example-script.nano'; // Update this path
    const nanoscriptData = fs.readFileSync(nanoscriptFilePath);
    const nanoscriptAccount = Keypair.generate();
    
    // Load the private key from the "secret" file
    const secretKeyString = fs.readFileSync('secret', { encoding: 'utf8' });
    let secretKey = bs58.decode(secretKeyString.trim()); // Ensure to trim any whitespace
    const payerAccount = Keypair.fromSecretKey(secretKey);
    
    const rentExemptionAmount = await connection.getMinimumBalanceForRentExemption(nanoscriptData.length + 1);
    const programId = new PublicKey("DcoLqENERXkFWY7TyZJk5w4srkshn2rF25NdCCCoVTnH");

    // Create account and write data instruction
    const createAccountInstruction = SystemProgram.createAccount({
        fromPubkey: payerAccount.publicKey,
        newAccountPubkey: nanoscriptAccount.publicKey,
        lamports: rentExemptionAmount,
        space: nanoscriptData.length + 1,
        programId,
    });

    const writeDataInstruction = new TransactionInstruction({
        keys: [{ pubkey: nanoscriptAccount.publicKey, isSigner: false, isWritable: true }],
        programId,
        data: Buffer.concat([Buffer.from([0]), nanoscriptData]), // Prepend the instruction number
    });

    const executeInstruction = new TransactionInstruction({
        keys: [{ pubkey: nanoscriptAccount.publicKey, isSigner: false, isWritable: false }],
        programId: programId,
        data: Buffer.from([0x01]),
    });

    // Combine instructions into a single transaction
    const transaction = new Transaction().add(createAccountInstruction, writeDataInstruction , executeInstruction);
    console.log('Creating the NanoScript account and uploading the script...');
    let sig = await connection.sendTransaction(transaction, [payerAccount, nanoscriptAccount], {skipPreflight: false, preflightCommitment: 'confirmed'});

    console.log(`Transaction confirmed with signature: ${sig}`);

    console.log('NanoScript account created and script uploaded successfully:', nanoscriptAccount.publicKey.toString());

     // Open the Solana Explorer in the default web browser
     const explorerUrl = `https://explorer.solana.com/tx/${sig}?cluster=mainnet-beta`;
     import('open').then((open) => {
        const explorerUrl = `https://explorer.solana.com/tx/${sig}?cluster=mainnet-beta`;
        open.default(explorerUrl); // Use .default to access the default export of the ESM module
        console.log(`Opened Solana Explorer at ${explorerUrl}`);
    }).catch(console.error);
}

main().catch(console.error);
