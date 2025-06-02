// Frontend Test Example for NFT Vault Extension

import { StacksTestnet } from '@stacks/network';
import { 
  uintCV, 
  contractPrincipalCV, 
  callReadOnlyFunction,
  cvToValue
} from '@stacks/transactions';
import { userSession } from '../services/auth';
import { 
  depositNFT, 
  claimNFTAsHeir 
} from '../services/vaultService';

// Configuration
const NETWORK = new StacksTestnet();
const CONTRACT_ADDRESS = 'ST39PS2F0FVJKXD0D3G41ATAEK13NXXDN8VGQN5FW';
const CONTRACT_NAME = 'timelock-vault';
const NFT_EXTENSION_NAME = 'nft-vault-extension';

// Example NFT info (would be provided by user in real app)
const EXAMPLE_NFT_CONTRACT = 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.example-nft';
const EXAMPLE_TOKEN_ID = 1;

// Function to demonstrate depositing an NFT
async function demonstrateNFTDeposit(vaultId: number) {
  console.log(`Depositing NFT to vault #${vaultId}...`);
  console.log(`NFT Contract: ${EXAMPLE_NFT_CONTRACT}`);
  console.log(`Token ID: ${EXAMPLE_TOKEN_ID}`);
  
  try {
    // In a real app, this would be triggered by a user interface
    const result = await depositNFT({
      vaultId: vaultId,
      contractAddress: EXAMPLE_NFT_CONTRACT,
      tokenId: EXAMPLE_TOKEN_ID
    }, NETWORK);
    
    console.log('NFT deposit transaction submitted!');
    console.log('Transaction ID:', result.txId);
    
    return result;
  } catch (error) {
    console.error('Error depositing NFT:', error);
    throw error;
  }
}

// Function to demonstrate claiming an NFT as an heir
async function demonstrateNFTClaim(vaultId: number) {
  console.log(`Claiming NFT from vault #${vaultId} as an heir...`);
  console.log(`NFT Contract: ${EXAMPLE_NFT_CONTRACT}`);
  console.log(`Token ID: ${EXAMPLE_TOKEN_ID}`);
  
  try {
    // In a real app, this would be triggered by a user interface
    const result = await claimNFTAsHeir(
      vaultId,
      EXAMPLE_NFT_CONTRACT,
      EXAMPLE_TOKEN_ID,
      NETWORK
    );
    
    console.log('NFT claim transaction submitted!');
    console.log('Transaction ID:', result.txId);
    
    return result;
  } catch (error) {
    console.error('Error claiming NFT:', error);
    throw error;
  }
}

// Function to check if an NFT is in a vault
async function checkNFTInVault(vaultId: number) {
  console.log(`Checking if NFT is in vault #${vaultId}...`);
  
  // This would be a read-only function call to check the NFT status
  // Note: This is just for demonstration - the actual contract would need a getter function
  console.log('NFT status check would be implemented here');
  console.log('Using the NFT Management component in the UI to interact with NFTs');
  
  return {
    isInVault: true, // Placeholder - would come from contract in real implementation
    claimed: false
  };
}

// Main demonstration function
export async function runNFTExtensionDemo() {
  console.log('=== NFT Vault Extension Demo ===');
  
  // For demo purposes, we're using vault ID 1
  // In a real app, the user would select from their vaults
  const vaultId = 1;
  
  console.log(`Using vault ID: ${vaultId}`);
  console.log('\nTo interact with the NFT extension:');
  console.log('1. Create a vault using the main contract');
  console.log('2. Use the NFT Management component to deposit NFTs');
  console.log('3. Heirs can claim NFTs after unlock conditions are met');
  
  console.log('\nThese operations require:');
  console.log('- An authenticated user (connect wallet)');
  console.log('- A valid vault ID');
  console.log('- NFTs that implement the SIP-009 standard');
  
  console.log('\nEnd of NFT Extension Demo');
}

// Export the demo functions
export { 
  demonstrateNFTDeposit, 
  demonstrateNFTClaim, 
  checkNFTInVault 
};
