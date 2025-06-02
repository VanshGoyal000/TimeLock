export interface Heir {
  address: string;
  percentage: number;
}

export interface Guardian {
  address: string;
  hasSigned: boolean;
}

export interface VaultAsset {
  type: 'STX' | 'FT';
  amount?: number;
  contractAddress?: string;
  name?: string;
}

export interface Vault {
  id: number;
  owner: string;
  unlockHeight: number;
  inactivityTimeout: number;
  lastActiveHeight: number;
  assets: VaultAsset[];
  heirs: Heir[];
  active: boolean;
  guardians?: Guardian[];
  signaturesRequired?: number;
  notesGaiaUrl?: string;
}

export interface CreateVaultParams {
  unlockHeight: number;
  inactivityTimeout: number;
}

export interface AddHeirParams {
  vaultId: number;
  heirAddress: string;
  percentage: number;
}

export interface DepositAssetParams {
  vaultId: number;
  assetType: 'STX' | 'FT';
  amount?: number;
  contractAddress?: string;
}
