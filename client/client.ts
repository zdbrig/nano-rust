import * as web3 from "@solana/web3.js";
// Manually initialize variables that are automatically defined in Playground
const PROGRAM_ID = new web3.PublicKey("DcoLqENERXkFWY7TyZJk5w4srkshn2rF25NdCCCoVTnH");
const connection = new web3.Connection("https://roseanna-klwrje-fast-mainnet.helius-rpc.com", "confirmed");
const wallet = { keypair: web3.Keypair.generate() };

// Client


const programId = new web3.PublicKey(
  "DcoLqENERXkFWY7TyZJk5w4srkshn2rF25NdCCCoVTnH"
);
const scriptAccount = new web3.PublicKey(
  "2EJGTQC9CPbVmFQzNXEHdLW1GNkd4eAf7ue6mbnSRpXn"
);



const instruction = new web3.TransactionInstruction({
  keys: [{ pubkey: scriptAccount, isSigner: false, isWritable: false }],
  programId: programId,
  data: Buffer.from([0x01]),
});

const transaction = new web3.Transaction().add(instruction);
// Ensure the transaction is signed by the wallet
transaction.feePayer = wallet.keypair.publicKey;
let blockhashObj = await connection.getLatestBlockhash();
transaction.recentBlockhash = blockhashObj.blockhash;

// Sign the transaction with the wallet's keypair
const signedTransaction = await web3.sendAndConfirmTransaction(
  connection,
  transaction,
  [wallet.keypair] // Signers
);

console.log(`Transaction confirmed with signature: ${signedTransaction}`);
