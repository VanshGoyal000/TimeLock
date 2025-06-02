// Node.js test script for Stacks contract interaction

// Use CommonJS require instead of ES modules
const { AppConfig, UserSession } = require('@stacks/auth');
const { StacksTestnet, StacksMainnet } = require('@stacks/network');
const transactions = require('@stacks/transactions');
const fetch = require('node-fetch');

// Configuration settings - will be updated by Clarinet deployment
const CONTRACT_ADDRESS = 'ST39PS2F0FVJKXD0D3G41ATAEK13NXXDN8VGQN5FW';
const CONTRACT_NAME = 'timelock-vault';
const PRIVATE_KEY = process.env.STACKS_PRIVATE_KEY;  // Set this as an environment variable

if (!PRIVATE_KEY) {
  console.error('Error: STACKS_PRIVATE_KEY environment variable not set');
  console.error('Please set your private key by running:');
  console.error('$env:STACKS_PRIVATE_KEY="your-private-key-here"  # PowerShell');
  console.error('export STACKS_PRIVATE_KEY=your-private-key-here   # Bash/Linux');
  process.exit(1);
}

// Create user session
const appConfig = new AppConfig();
const userSession = new UserSession({ appConfig });

// Get network
function getNetwork(networkName) {
  return networkName === 'mainnet' 
    ? new StacksMainnet() 
    : new StacksTestnet();
}

// Create vault function
async function createVault(params, network) {
  const { unlockHeight, inactivityTimeout } = params;

  try {
    // Transaction options
    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'create-vault',
      functionArgs: [
        transactions.uintCV(unlockHeight),
        transactions.uintCV(inactivityTimeout)
      ],
      senderKey: PRIVATE_KEY,
      network,
      anchorMode: transactions.AnchorMode.Any,
      postConditionMode: transactions.PostConditionMode.Deny,
      fee: 10000
    };

    // Create and sign transaction
    const transaction = await transactions.makeContractCall(txOptions);

    // Broadcast transaction
    console.log('Broadcasting transaction to network...');
    const txResult = await transactions.broadcastTransaction(transaction, network);
    console.log('Transaction result:', JSON.stringify(txResult, null, 2));

    return txResult;
  } catch (error) {
    console.error('Error creating vault:', error);
    throw error;
  }
}

// Main test function 
async function testCreateVault() {
  try {
    const network = getNetwork('testnet');
    
    console.log('Fetching current block height...');
    const response = await fetch('https://stacks-node-api.testnet.stacks.co/extended/v1/block');
    const data = await response.json();
    const currentBlockHeight = data.results[0].height;
    console.log(`Current block height: ${currentBlockHeight}`);
    
    // Set unlock height to 1000 blocks from now
    const unlockHeight = currentBlockHeight + 1000;
    console.log(`Setting unlock height to: ${unlockHeight}`);
    
    // Create vault with 144 block inactivity timeout (approximately 1 day)
    console.log('Creating vault with 144 block inactivity timeout...');
    const result = await createVault(
      {
        unlockHeight,
        inactivityTimeout: 144
      },
      network
    );
    
    console.log('Vault creation transaction submitted!');
    if (result.txid) {
      console.log(`Transaction ID: ${result.txid}`);
      console.log(`View on explorer: https://explorer.testnet.stacks.co/txid/${result.txid}`);
    }
    
    return result;
  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  }
}

// Run the test
console.log('Starting contract test...');
testCreateVault()
  .then(() => console.log('Test completed successfully'))
  .catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });