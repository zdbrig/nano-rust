const fs = require('fs');
const path = require('path');
const esprima = require('esprima');
const { exec } = require('child_process');

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
            // Assuming console.log for simplicity
            node.arguments.forEach(arg => {
                instructions.push(...compileAST(arg));
            });
            instructions.push('PRINT');
            break;
    }
    return instructions;
}

// Function to read, compile, and save the compiled code
function compileAndSave(filePath) {
    fs.readFile(filePath, 'utf8', (err, code) => {
        if (err) {
            console.error('Error reading the JavaScript file:', err);
            process.exit(-1);
            return;
        }

        // Parse the JavaScript code to an AST
        const ast = esprima.parseScript(code);

        // Compile the AST to custom instructions
        const instructions = compileAST(ast);

        // Prepare the compiled code as a string
        const compiledCode = instructions.join('\n') + "\n";

        // Determine the output file path
        const outputFilePath = path.join(
            path.dirname(filePath),
            path.basename(filePath, '.js') + '.nano'
        );

        // Write the compiled instructions to the output file
        fs.writeFile(outputFilePath, compiledCode, (err) => {
            if (err) {
                console.error('Error writing the compiled file:', err);
                process.exit(-1);
            } else {
                console.log(`Compiled code has been saved to ${outputFilePath}.`);
            }
        });
    });
}

// Main function to handle command line arguments
function main() {
    const args = process.argv.slice(2);
    if (args.length !== 1) {
        console.log('Usage: node index.js <path_to_js_file>');
        return;
    }
    compileAndSave(args[0]);

    // Execute the command to run node index.js
    exec('node deployer.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }
    });
}

main();
