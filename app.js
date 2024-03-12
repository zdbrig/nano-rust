const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const esprima = require('esprima');
const { exec } = require('child_process');
const { Connection, PublicKey, clusterApiUrl, Keypair, SystemProgram, Transaction, TransactionInstruction } = require('@solana/web3.js');
require('dotenv').config();


const bs58 = require('bs58');

const app = express();
const port = 5007;
const host = "0.0.0.0"

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Function to traverse the AST and compile to custom instructions
function compileAST(node) {
    const instructions = [];
    switch (node.type) {
        case 'Program':
            node.body.forEach(childNode => instructions.push(...compileAST(childNode)));
            break;
        case 'ExpressionStatement':
            instructions.push(...compileAST(node.expression));
            break;
        case 'BinaryExpression':
            instructions.push(...compileAST(node.left));
            instructions.push(...compileAST(node.right));
            if (node.operator === '+') instructions.push('ADD');
            else if (node.operator === '-') instructions.push('SUB');
            else if (node.operator === '*') instructions.push('MUL');
            else if (node.operator === '/') instructions.push('DIV');
            break;
        case 'Literal':
            instructions.push(`PUSH ${node.value}`);
            break;
        case 'CallExpression':
            node.arguments.forEach(arg => {
                instructions.push(...compileAST(arg));
            });
            instructions.push('PRINT');
            break;
    }
    return instructions;
}

async function deployScript(compiledCode) {
    // Load the secretKey from the environment variables
    const secretKeyString = process.env.SECRET_KEY;

    console.log(secretKeyString)

    const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
    const nanoscriptData = Buffer.from(compiledCode);
    const nanoscriptAccount = Keypair.generate();
    
    let secretKey = bs58.decode(secretKeyString.trim());
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

    const transaction = new Transaction().add(createAccountInstruction, writeDataInstruction , executeInstruction);
    const signature = await connection.sendTransaction(transaction, [payerAccount, nanoscriptAccount], {skipPreflight: false, preflightCommitment: 'confirmed'});
    
    return { signature: signature, explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=mainnet-beta` };
}

// Endpoint to compile and deploy code
app.post('/deploy', async (req, res) => {
    const { code } = req.body; // Assume code is the JavaScript code to compile
    if (typeof code !== 'string') {
        return res.status(400).send('Invalid request: Code must be provided.');
    }

    try {
        // Assuming compileAST is a function that compiles the JavaScript code to your custom bytecode
        const compiledCode = compileAST(esprima.parseScript(code)); // Add your compilation logic here
        console.log("\nCompiled\n")
        
        const deploymentResult = await deployScript(compiledCode.join('\n') + "\n");
        console.log("deployed\n")

        console.log(`Transaction confirmed with signature`);

        console.log('NanoScript account created and script uploaded successfully');


        res.json({ success: true, message : "print(1);", code  : compiledCode, deploymentResult : deploymentResult , });
        

    } catch (error) {
        res.status(500).send('Error compiling or deploying the script: ' + error.message);
    }
});


app.listen(port, host, () => {
    console.log(`Server running on port ${port}`);
});
