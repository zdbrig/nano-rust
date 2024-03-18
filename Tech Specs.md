# Introduction 

NovaScript uses the simplicity of JavaScript and the power of a C-language interpreter to help developers write clear and effective blockchain scripts quickly. The aim is to optimize these scripts for executing on-chain investment rules. 

## Framework

NovaScripts can be built using the following components:

### Token Mint Account (A)
Using the token extension program.

### Source Account
The Source Account holds the Novascript bytecode, containing all the logic and operations to be executed by the VM. The Token mint (A) will this the source as a part of the metadata.

### Stack Account
The Stack Account simulates a CPU stack, managing temporary data, execution flow, and function calls within Novascripts. The Token mint (A) will this the stack account as a part of the metadata.

### Data Account
Acting as the main memory, the Data Account stores variables, state information, and the data manipulated during the execution of scripts. The Token mint (A) will this the data account as a part of the metadata.

### Execution Program
The Execution Program is a custom Solana program developed in C. It interprets and executes Novascript bytecode, managing Fuel consumption and facilitating interaction with the Source, Stack, and Data Accounts according to the script's logic. 

### Fuel Token Mint (B)
Using the token extension program (B) will be delegated to the Execution program.

### Fuel Miner tool
An off-chain program that will execute the scripts and mine the fuel.

### Trading Primitives
NovaScripts will come with a set of APIs that easily connect with the major Solana’s DeFi applications: Marginfi, Kamino, Orca, Raydium, Solend and others.

### C Programming Language Interpreter
The backbone of NovaScript's execution environment is its C Programming Language Interpreter, developed in Rust. This ensures fast, reliable, and precise interpretation of Novascripts within the Solana Virtual Machine (VM).


## Infrastructure

### Fuel
In the spirit of decentralization and removing single point of failure, NovaScripts will be capable of being run by 3rd party providers that are paid in Nova tokens. Nova Labs will be the first providers of this infrastructure.

### Meta Data Pointers
A metadata pointer account will point to the source, stack and Data and attach directly to the token (A). We will use data and stack persistence to realize step by step execution, similarly to a virtual CPU.

<img src="https://github.com/NovaFi/nano-rust/blob/main/images/Diagram%201.png?raw=true">

### Permanent Delegate
The Fuel account will be delegated to the execution program to allow fuel transfer between A and the Solana fee payer.

<img src="https://github.com/NovaFi/nano-rust/blob/main/images/Diagram%202.png?raw=true">

# Development Milestones

## NovaScript Beta Launch

### Create the NovaScript Syntax
Create a detailed NovaScript specification Design the NovaScript language syntax, inspired by JavaScript for accessibility. 
Define the architecture for the custom Solana program, including the execution model and Fuel mechanism.

### Deploy onto Solana Test Net
- Develop the NovaScript interpreter in C.
- Develop the compact Javascript compiler and instruction generator.
- Implement the Fuel mechanism within the interpreter. 
- Develop and test the Source, Stack, and Data Account structures. 
- Conduct extensive testing of both simple and complex trading strategies Incorporate the feedback from test net users having conducted a minimum of 10 user interviews.

### Deploy Decentralized Infrastructure
Develop the tools for executing the script and claim the fuel. It’s a multiplatform application where the user can configure and start running in the background. It will detect over blockchain fuelled accounts that are waiting for an execution transaction.

### Deploy onto Solana Main-Net 
- Prepare comprehensive documentation that can be used by external developers to fork or upgrade NovaScripts for their needs.
- Integrate NovaScripts with the APIs of Solana’s major DeFi applications: Marginfi, Kamino, Orca, Raydium, Solend and others. 
- Develop Debugging and monitoring tools that have integration with IDEs.
- Incorporate the feedback from main-net users having conducted a minimum of 20 user interviews.

## Maintenance

### Automated Audits
Integration with X-Ray tool so users can audit their NovaScripts prior to deployment. 

### Servers & infrastructure
Nova will be used to pay infrastructure providers that run the NovaScripts. We will be the first people to provide infrastructure to Novascripts and would like a small budget for doing this.

### On-going Bug fixes 
To ensure security for our users, we will develop a set of debugging and monitoring tools that have integration with IDEs Why NovaScript Stands Out NovaScript uses something called Fuel to manage how much computing power scripts use, which helps keep things efficient and offers rewards through converting Fuel into Nova, Solana's currency. It's especially good for DeFi applications because it includes special features for trading.
