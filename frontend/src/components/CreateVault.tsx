import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { networkAtom } from '../store/atoms';
import { createVault } from '../services/vaultService';
import { getNetwork } from '../services/auth';

interface BlockEstimate {
  blocks: number;
  days: number;
}

const calculateBlocksFromDays = (days: number): number => {
  // Stacks produces blocks every ~10 minutes
  const blocksPerDay = 6 * 24; // 6 blocks per hour * 24 hours
  return Math.floor(days * blocksPerDay);
};

const calculateDaysFromBlocks = (blocks: number): number => {
  const blocksPerDay = 6 * 24; // 6 blocks per hour * 24 hours
  return Math.round((blocks / blocksPerDay) * 10) / 10; // Round to 1 decimal place
};

const VaultCreateForm: React.FC = () => {
  const [networkName] = useAtom(networkAtom);
  const navigate = useNavigate();
  const [days, setDays] = useState(365); // Default to 1 year
  const [inactivityDays, setInactivityDays] = useState(30); // Default to 30 days
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const unlockBlocks = calculateBlocksFromDays(days);
  const inactivityBlocks = calculateBlocksFromDays(inactivityDays);
  
  const handleCreateVault = async () => {
    try {
      setIsSubmitting(true);
      
      const network = getNetwork(networkName);
      const currentBlockHeight = await fetch(`https://stacks-node-api.${networkName}.stacks.co/extended/v1/block`)
        .then(res => res.json())
        .then(data => data.results[0].height);
      
      const unlockHeight = currentBlockHeight + unlockBlocks;
      
      await createVault(
        {
          unlockHeight,
          inactivityTimeout: inactivityBlocks
        },
        network
      );
      
      toast.success('Vault creation transaction submitted!');
      navigate('/my-vaults');
    } catch (error) {
      console.error('Error creating vault:', error);
      toast.error('Failed to create vault. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create a New TimeLock Vault</h2>

      {step === 1 ? (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Time-Based Release</h3>
            <p className="text-gray-600 mb-4">
              Your assets will be unlocked after a specified time period, even if you remain active.
            </p>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Unlock after (days):</label>
              <input
                type="range"
                min="30"
                max="3650"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>1 month</span>
                <span>10 years</span>
              </div>
              <p className="mt-2 text-center font-medium">
                {days} days (~{calculateDaysFromBlocks(unlockBlocks)} days, {unlockBlocks} blocks)
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Inactivity-Based Release</h3>
            <p className="text-gray-600 mb-4">
              Your assets will be unlocked if you don't "ping" the vault for a specified period.
            </p>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Release after inactivity (days):</label>
              <input
                type="range"
                min="7"
                max="365"
                value={inactivityDays}
                onChange={(e) => setInactivityDays(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>1 week</span>
                <span>1 year</span>
              </div>
              <p className="mt-2 text-center font-medium">
                {inactivityDays} days (~{calculateDaysFromBlocks(inactivityBlocks)} days, {inactivityBlocks} blocks)
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              onClick={() => setStep(2)}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Vault Summary</h3>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="mb-2">
                <span className="font-medium">Time-Based Release:</span> {days} days
              </p>
              <p>
                <span className="font-medium">Inactivity Release:</span> {inactivityDays} days
              </p>
            </div>
            <p className="text-gray-600 mt-4">
              After creating the vault, you'll be able to:
            </p>
            <ul className="list-disc list-inside text-gray-600 ml-2">
              <li>Deposit STX and NFT assets</li>
              <li>Add heir addresses and allocation percentages</li>
              <li>Configure multi-signature guardians</li>
              <li>Store private notes for heirs</li>
            </ul>
          </div>

          <div className="flex justify-between">
            <button
              className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-100"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
              onClick={handleCreateVault}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Vault'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VaultCreateForm;
