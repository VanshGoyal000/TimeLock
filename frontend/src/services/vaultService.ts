import { 
  callReadOnlyFunction, 
  contractPrincipalCV, 
  cvToValue, 
  noneCV,
  someCV,
  standardPrincipalCV, 
  uintCV,
  bufferCV
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';
import { userSession } from './auth';
import { Vault, CreateVaultParams, AddHeirParams, DepositAssetParams } from '../types/vault';

// Update this to your deployed contract address (the wallet address that deployed it)
const CONTRACT_ADDRESS = 'ST39PS2F0FVJKXD0D3G41ATAEK13NXXDN8VGQN5FW';
// Update this to match the contract name in your deployment plan
const CONTRACT_NAME = 'timelock-vault'; // Updated to match deployment

export const createVault = async (
  params: CreateVaultParams,
  network: StacksNetwork
) => {
  const { unlockHeight, inactivityTimeout } = params;

  const functionArgs = [
    uintCV(unlockHeight),
    uintCV(inactivityTimeout)
  ];

  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'create-vault',
    functionArgs,
    network,
    appDetails: {
      name: 'TimeLock Vault',
      icon: window.location.origin + '/logo.png',
    },
    onFinish: (data: any) => {
      console.log('Transaction submitted:', data);
      return data;
    },
  };

  return userSession.openContractCall(options);
};

export const depositSTX = async (
  params: DepositAssetParams,
  network: StacksNetwork
) => {
  const { vaultId, amount } = params;

  if (!amount) throw new Error('Amount is required for STX deposits');

  const functionArgs = [
    uintCV(vaultId),
    uintCV(amount)
  ];

  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'deposit-stx',
    functionArgs,
    network,
    appDetails: {
      name: 'TimeLock Vault',
      icon: window.location.origin + '/logo.png',
    },
    onFinish: (data: any) => {
      console.log('Transaction submitted:', data);
      return data;
    },
  };

  return userSession.openContractCall(options);
};

export const addHeir = async (
  params: AddHeirParams,
  network: StacksNetwork
) => {
  const { vaultId, heirAddress, percentage } = params;

  const functionArgs = [
    uintCV(vaultId),
    standardPrincipalCV(heirAddress),
    uintCV(percentage)
  ];

  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'add-heir',
    functionArgs,
    network,
    appDetails: {
      name: 'TimeLock Vault',
      icon: window.location.origin + '/logo.png',
    },
    onFinish: (data: any) => {
      console.log('Transaction submitted:', data);
      return data;
    },
  };

  return userSession.openContractCall(options);
};

export const pingVault = async (
  vaultId: number,
  network: StacksNetwork
) => {
  const functionArgs = [uintCV(vaultId)];

  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'ping',
    functionArgs,
    network,
    appDetails: {
      name: 'TimeLock Vault',
      icon: window.location.origin + '/logo.png',
    },
    onFinish: (data: any) => {
      console.log('Transaction submitted:', data);
      return data;
    },
  };

  return userSession.openContractCall(options);
};

export const storeNotesHash = async (
  vaultId: number, 
  notesHash: string,
  network: StacksNetwork
) => {
  // Convert hex string to buffer
  const hashBuffer = Buffer.from(notesHash, 'hex');

  const functionArgs = [
    uintCV(vaultId),
    bufferCV(hashBuffer)
  ];

  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'store-notes-hash',
    functionArgs,
    network,
    appDetails: {
      name: 'TimeLock Vault',
      icon: window.location.origin + '/logo.png',
    },
    onFinish: (data: any) => {
      console.log('Transaction submitted:', data);
      return data;
    },
  };

  return userSession.openContractCall(options);
};

export const claimAsHeir = async (
  vaultId: number,
  network: StacksNetwork
) => {
  const functionArgs = [uintCV(vaultId)];

  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'claim-as-heir',
    functionArgs,
    network,
    appDetails: {
      name: 'TimeLock Vault',
      icon: window.location.origin + '/logo.png',
    },
    onFinish: (data: any) => {
      console.log('Transaction submitted:', data);
      return data;
    },
  };

  return userSession.openContractCall(options);
};
