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


# Code Documentation

## Compiler (compiler.js)

The compiler script is responsible for reading a JavaScript file, parsing it into an Abstract Syntax Tree (AST), and compiling it into a custom set of instructions. The compiled code is then saved as a `.nano` file.

### Functions

- `compileAST(node)`: Recursively traverses the AST and generates custom instructions based on the node types.
  - `node`: The AST node to compile.
  - Returns an array of custom instructions.

- `compileAndSave(filePath)`: Reads the JavaScript file, compiles it to custom instructions, and saves the compiled code as a `.nano` file.
  - `filePath`: The path to the JavaScript file to compile.

- `main()`: The main function that handles command line arguments and executes the compiler and deployer scripts.

### Dependencies

- `fs`: File system module for reading and writing files.
- `path`: Path module for handling file paths.
- `esprima`: Library for parsing JavaScript code into an AST.
- `child_process`: Module for executing child processes (used to run the deployer script).

## Deployer (deployer.js)

The deployer script is responsible for deploying the compiled `.nano` script to the Solana blockchain.

### Functions

- `main()`: The main function that deploys the `.nano` script to the Solana blockchain.
  - Establishes a connection to the Solana cluster.
  - Loads the compiled `.nano` script from the specified file path.
  - Generates a new account keypair for the script.
  - Loads the payer account's private key from the "secret" file.
  - Creates instructions for creating the account, writing the script data, and executing the script.
  - Sends the transaction to the Solana blockchain.
  - Logs the transaction signature and the public key of the newly created account.
  - Opens the Solana Explorer in the default web browser to display the transaction details.

### Dependencies

- `fs`: File system module for reading files.
- `@solana/web3.js`: Solana web3.js library for interacting with the Solana blockchain.
- `bs58`: Library for encoding and decoding base58 strings.

## Solana Program (program.rs)

The Solana program is written in Rust and defines the on-chain logic for executing the compiled `.nano` scripts.

### Enums

- `ScriptError`: Defines custom error types for the script execution.

### Functions

- `process_instruction(program_id, accounts, instruction_data)`: The entry point function for processing instructions.
  - `program_id`: The public key of the program.
  - `accounts`: The array of account information.
  - `instruction_data`: The instruction data passed to the program.
  - Returns a `ProgramResult` indicating the success or failure of the instruction processing.

- `write_script(accounts, data)`: Writes the script data to the specified account.
  - `accounts`: The array of account information.
  - `data`: The script data to write.
  - Returns a `ProgramResult` indicating the success or failure of the write operation.

- `interpret_script(accounts)`: Interprets and executes the script stored in the specified account.
  - `accounts`: The array of account information.
  - Returns a `ProgramResult` indicating the success or failure of the script execution.

### Dependencies

- `solana_program`: Solana program library for building smart contracts on the Solana blockchain.

The Solana program defines the logic for handling the writing and execution of the compiled `.nano` scripts. It uses the `solana_program` library to interact with the Solana runtime and process instructions received from the deployer.

Note: The Solana program assumes a specific format for the compiled `.nano` scripts and may need to be modified to support additional instructions and functionality as required.
