const fs = require('fs');
const { Connection, PublicKey, clusterApiUrl, Keypair, SystemProgram, Transaction, TransactionInstruction } = require('@solana/web3.js');
const bs58 = require('bs58');

async function main() {
    const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
    const nanoscriptFilePath = 'printer.nano'; // Update this path
    const nanoscriptData = fs.readFileSync(nanoscriptFilePath);
    const nanoscriptAccount = Keypair.generate();
    
    let secretKey = bs58.decode("private_key");
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
}

main().catch(console.error);
