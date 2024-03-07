# Creating an NFT with Script as Metadata

This document outlines the steps to create a non-fungible token (NFT) where the metadata is the compiled `.nano` script itself.

## Prerequisites

- Solana CLI tools installed
- Solana account with sufficient balance to cover transaction fees and rent exemption
- Compiled `.nano` script file

## Steps

1. Create a new NFT mint:
   ```
   spl-token create-token --decimals 0
   ```
   This command will generate a new token address for the NFT and output the token address and the token's public key. The `--decimals 0` flag ensures that the token is non-divisible, which is typically the case for NFTs.

2. Create a token account to hold the NFT:
   ```
   spl-token create-account <token_address>
   ```
   Replace `<token_address>` with the token address obtained in step 1.

3. Mint the NFT to the token account:
   ```
   spl-token mint <token_address> 1
   ```
   Replace `<token_address>` with the token address. This command mints a single NFT to the token account.

4. Create a metadata account for the NFT:
   ```
   spl-token create-metadata-account <token_address> <metadata_account_keypair>
   ```
   Replace `<token_address>` with the token address and `<metadata_account_keypair>` with a new keypair file for the metadata account.

5. Read the compiled `.nano` script file:
   ```
   cat <path_to_compiled_script>
   ```
   Replace `<path_to_compiled_script>` with the path to your compiled `.nano` script file. This command will output the contents of the script file.

6. Prepare the metadata JSON file:
   Create a JSON file (e.g., `metadata.json`) with the following structure:
   ```json
   {
     "name": "My NFT",
     "symbol": "MNFT",
     "description": "My custom NFT with script as metadata",
     "script": "<compiled_script_content>"
   }
   ```
   Replace `<compiled_script_content>` with the contents of your compiled `.nano` script file, obtained in step 5. Make sure to escape any special characters in the script content if necessary.

7. Write the metadata to the metadata account:
   ```
   spl-token write-metadata <token_address> <metadata_account_pubkey> metadata.json
   ```
   Replace `<token_address>` with the token address, `<metadata_account_pubkey>` with the public key of the metadata account created in step 4, and `metadata.json` with the path to your metadata JSON file.

8. Verify the metadata:
   ```
   spl-token read-metadata <metadata_account_pubkey>
   ```
   Replace `<metadata_account_pubkey>` with the public key of the metadata account. This command will display the metadata associated with the NFT, including the script content.

That's it! You have now created an NFT with the compiled `.nano` script as its metadata. The script can be accessed and executed by anyone holding the NFT.

Note: Make sure to handle the script content appropriately in your metadata JSON file, considering any character escaping or formatting requirements. Additionally, ensure that you have the necessary permissions and meet the requirements for creating and managing NFTs on the Solana blockchain.
