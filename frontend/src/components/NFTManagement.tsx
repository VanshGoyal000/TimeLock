import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { userSessionAtom, networkNameAtom } from '../store/atoms';
import { toast } from 'react-hot-toast';
import { depositNFT, claimNFTAsHeir } from '../services/vaultService';
import { getNetwork } from '../services/auth';

interface NFTManagementProps {
  vaultId: number;
  isOwner: boolean;
  isHeir: boolean;
  canClaim: boolean;
  refreshVault: () => void;
}

const NFTManagement: React.FC<NFTManagementProps> = ({ 
  vaultId, 
  isOwner, 
  isHeir, 
  canClaim,
  refreshVault 
}) => {
  const [userSession] = useAtom(userSessionAtom);
  const [networkName] = useAtom(networkNameAtom);
  const [nftContract, setNftContract] = useState('');
  const [nftTokenId, setNftTokenId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDepositNFT = async () => {
    if (!userSession.isUserSignedIn()) {
      toast.error('Please sign in first');
      return;
    }

    if (!vaultId || !nftContract || !nftTokenId) {
      toast.error('Please enter NFT contract address and token ID');
      return;
    }

    setIsSubmitting(true);
    try {
      const network = getNetwork(networkName);
      await depositNFT({
        vaultId: vaultId,
        contractAddress: nftContract,
        tokenId: parseInt(nftTokenId)
      }, network);
      
      toast.success('NFT deposit transaction submitted!');
      setNftContract('');
      setNftTokenId('');
      setTimeout(refreshVault, 3000); // Refresh after a delay
    } catch (error) {
      console.error('Error depositing NFT:', error);
      toast.error('Failed to deposit NFT');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaimNFT = async () => {
    if (!userSession.isUserSignedIn()) {
      toast.error('Please sign in first');
      return;
    }

    if (!vaultId || !nftContract || !nftTokenId) {
      toast.error('Please enter NFT contract address and token ID');
      return;
    }

    setIsSubmitting(true);
    try {
      const network = getNetwork(networkName);
      await claimNFTAsHeir(
        vaultId,
        nftContract,
        parseInt(nftTokenId),
        network
      );
      
      toast.success('NFT claim transaction submitted!');
      setNftContract('');
      setNftTokenId('');
      setTimeout(refreshVault, 3000); // Refresh after a delay
    } catch (error) {
      console.error('Error claiming NFT:', error);
      toast.error('Failed to claim NFT');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-xl font-semibold mb-4">NFT Management</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 mb-2">NFT Contract Address:</label>
          <input
            type="text"
            value={nftContract}
            onChange={(e) => setNftContract(e.target.value)}
            placeholder="SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.my-nft"
            className="w-full p-2 border rounded"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Token ID:</label>
          <input
            type="number"
            value={nftTokenId}
            onChange={(e) => setNftTokenId(e.target.value)}
            placeholder="1"
            className="w-full p-2 border rounded"
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
        {isOwner && (
          <button
            onClick={handleDepositNFT}
            disabled={isSubmitting || !nftContract || !nftTokenId}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : 'Deposit NFT'}
          </button>
        )}
        
        {isHeir && canClaim && (
          <button
            onClick={handleClaimNFT}
            disabled={isSubmitting || !nftContract || !nftTokenId}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : 'Claim NFT'}
          </button>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Note: NFT must support the SIP-009 NFT standard.</p>
        <p>Format: {`<address>.<contract-name>`}</p>
      </div>
    </div>
  );
};

export default NFTManagement;
