# Usage Document

## Compiler

The compiler is a Node.js script that reads a JavaScript file, parses it into an Abstract Syntax Tree (AST), and compiles it into a custom set of instructions. The compiled code is then saved as a `.nano` file.

### Prerequisites

- Node.js installed on your system
- Required dependencies: `esprima`, `child_process`, `fs`, `path`

### Usage

1. Save the compiler script in a file named `compiler.js`.

2. Run the compiler script from the command line using the following command:
   ```
   node compiler.js <path_to_js_file>
   ```
   Replace `<path_to_js_file>` with the path to the JavaScript file you want to compile.

3. The compiler will read the JavaScript file, compile it into custom instructions, and save the compiled code as a `.nano` file in the same directory as the input file.

4. After successful compilation, the compiler will automatically execute the `deployer.js` script using the `node deployer.js` command.

## Deployer

The deployer is a Node.js script that deploys the compiled `.nano` script to the Solana blockchain.

### Prerequisites

- Node.js installed on your system
- Required dependencies: `@solana/web3.js`, `bs58`, `fs`
- A Solana account with sufficient balance to cover the transaction fees and rent exemption

### Usage

1. Save the deployer script in a file named `deployer.js`.

2. Create a file named `secret` in the same directory as the deployer script, and paste your Solana account's private key in it.

3. Update the `nanoscriptFilePath` variable in the deployer script to point to the compiled `.nano` file you want to deploy.

4. Run the deployer script using the following command:
   ```
   node deployer.js
   ```

5. The deployer will create a new account on the Solana blockchain, upload the compiled `.nano` script to that account, and execute the script.

6. After successful deployment, the deployer will log the transaction signature and the public key of the newly created account.

7. The deployer will automatically open the Solana Explorer in your default web browser, displaying the transaction details.

## Solana Program

The Solana program is written in Rust and defines the on-chain logic for executing the compiled `.nano` scripts.

### Prerequisites

- Rust programming language installed on your system
- Solana CLI tools installed

### Usage

1. Save the Solana program code in a file with a `.rs` extension (e.g., `program.rs`).

2. Build the program using the Solana CLI:
   ```
   solana program build
   ```

3. Deploy the program to the Solana blockchain using the Solana CLI:
   ```
   solana program deploy <path_to_program_binary>
   ```
   Replace `<path_to_program_binary>` with the path to the generated program binary.

4. The program will be deployed to the Solana blockchain, and you will receive the program ID.

5. Update the `programId` variable in the deployer script with the obtained program ID.

6. The deployed program will handle the execution of the compiled `.nano` scripts when invoked by the deployer.

Note: Make sure to have sufficient SOL balance in your Solana account to cover the transaction fees and rent exemption for deploying and executing the program.

That's it! You can now use the compiler to compile JavaScript code into custom instructions, deploy the compiled scripts using the deployer, and execute them on the Solana blockchain using the deployed program.
