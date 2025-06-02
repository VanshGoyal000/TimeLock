import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { toast } from 'react-toastify';
import { networkAtom, userSessionAtom } from '../store/atoms';
import { getNetwork } from '../services/auth';
import { depositSTX, addHeir, pingVault, storeNotesHash, claimAsHeir } from '../services/vaultService';
import { Vault, VaultAsset, Heir } from '../types/vault';
import { encode } from '@stacks/storage';

const VaultManage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [networkName] = useAtom(networkAtom);
  const [userSession] = useAtom(userSessionAtom);
  const [vault, setVault] = useState<Vault | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assets');
  const [stxAmount, setStxAmount] = useState('');
  const [heirAddress, setHeirAddress] = useState('');
  const [heirPercentage, setHeirPercentage] = useState(100);
  const [notes, setNotes] = useState('');
  
  // Mock function to fetch vault data - in a real app, this would call the blockchain
  const fetchVaultData = async () => {
    setLoading(true);
    try {
      // This would be replaced with actual blockchain calls
      const mockVault: Vault = {
        id: Number(id),
        owner: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        unlockHeight: 78500,
        inactivityTimeout: 4320, // 30 days in blocks
        lastActiveHeight: 70000,
        assets: [
          { type: 'STX', amount: 1000 }
        ],
        heirs: [],
        active: true
      };
      
      setVault(mockVault);
    } catch (error) {
      console.error('Error fetching vault data:', error);
      toast.error('Failed to load vault data');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (id) {
      fetchVaultData();
    }
  }, [id]);
  
  const handleDeposit = async () => {
    if (!id || !stxAmount || isNaN(Number(stxAmount))) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    try {
      const network = getNetwork(networkName);
      await depositSTX({
        vaultId: Number(id),
        assetType: 'STX',
        amount: Number(stxAmount) * 1000000 // Convert to microSTX
      }, network);
      
      toast.success('Deposit transaction submitted!');
      setStxAmount('');
      // In a real app, you would refresh the vault data after the transaction confirms
    } catch (error) {
      console.error('Error depositing STX:', error);
      toast.error('Failed to deposit STX');
    }
  };
  
  const handleAddHeir = async () => {
    if (!id || !heirAddress || heirPercentage <= 0 || heirPercentage > 100) {
      toast.error('Please enter valid heir details');
      return;
    }
    
    try {
      const network = getNetwork(networkName);
      await addHeir({
        vaultId: Number(id),
        heirAddress,
        percentage: heirPercentage
      }, network);
      
      toast.success('Add heir transaction submitted!');
      setHeirAddress('');
      setHeirPercentage(100);
      // In a real app, you would refresh the vault data after the transaction confirms
    } catch (error) {
      console.error('Error adding heir:', error);
      toast.error('Failed to add heir');
    }
  };
  
  const handlePing = async () => {
    if (!id) return;
    
    try {
      const network = getNetwork(networkName);
      await pingVault(Number(id), network);
      
      toast.success('Ping transaction submitted!');
      // In a real app, you would refresh the vault data after the transaction confirms
    } catch (error) {
      console.error('Error pinging vault:', error);
      toast.error('Failed to ping vault');
    }
  };
  
  const handleSaveNotes = async () => {
    if (!id || !notes) {
      toast.error('Please enter some notes');
      return;
    }
    
    try {
      // In a real app, you would:
      // 1. Encrypt the notes with the heir's public key
      // 2. Store the encrypted notes in Gaia
      // 3. Store the hash on the blockchain
      
      const notesBuffer = new TextEncoder().encode(notes);
      const notesHash = await crypto.subtle.digest('SHA-256', notesBuffer);
      const hashHex = Array.from(new Uint8Array(notesHash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      const network = getNetwork(networkName);
      await storeNotesHash(Number(id), hashHex, network);
      
      toast.success('Notes hash stored on blockchain!');
      setNotes('');
    } catch (error) {
      console.error('Error storing notes:', error);
      toast.error('Failed to store notes');
    }
  };
  
  if (loading) {
    return <div className="text-center p-8">Loading vault data...</div>;
  }
  
  if (!vault) {
    return <div className="text-center p-8">Vault not found</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Manage Vault #{id}</h2>
        
        {/* Vault Summary */}
        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Status:</span> {vault.active ? 'Active' : 'Inactive'}</p>
              <p><span className="font-medium">Owner:</span> {vault.owner.substring(0, 8)}...{vault.owner.substring(vault.owner.length - 8)}</p>
              <p><span className="font-medium">Last Active:</span> Block #{vault.lastActiveHeight}</p>
            </div>
            <div>
              <p><span className="font-medium">Unlock Height:</span> Block #{vault.unlockHeight}</p>
              <p><span className="font-medium">Inactivity Timeout:</span> {vault.inactivityTimeout} blocks</p>
              <button 
                onClick={handlePing}
                className="mt-2 bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700"
              >
                Ping to Prove Life
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px">
            <button 
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'assets' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('assets')}
            >
              Assets
            </button>
            <button 
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'heirs' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('heirs')}
            >
              Heirs
            </button>
            <button 
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'notes' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('notes')}
            >
              Notes
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="mb-6">
          {activeTab === 'assets' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Vault Assets</h3>
              
              {/* Asset List */}
              <div className="mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vault.assets.map((asset, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{asset.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {asset.type === 'STX' && `${asset.amount} μSTX`}
                          {asset.type === 'FT' && `${asset.amount}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {asset.type !== 'STX' && asset.contractAddress && (
                            <span className="text-sm text-gray-500">{asset.contractAddress}</span>
                          )}
                          {asset.name && (
                            <span className="block text-sm">{asset.name}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Deposit STX Form */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Deposit STX</h4>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Amount in STX"
                    value={stxAmount}
                    onChange={(e) => setStxAmount(e.target.value)}
                    className="border rounded-l px-4 py-2 w-full"
                  />
                  <button
                    onClick={handleDeposit}
                    className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
                  >
                    Deposit
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'heirs' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Manage Heirs</h3>
              
              {/* Heirs List */}
              <div className="mb-6">
                {vault.heirs.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {vault.heirs.map((heir, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {heir.address.substring(0, 8)}...{heir.address.substring(heir.address.length - 8)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {heir.percentage}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No heirs added yet
                  </div>
                )}
              </div>
              
              {/* Add Heir Form */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Add Heir</h4>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Heir address (ST...)"
                    value={heirAddress}
                    onChange={(e) => setHeirAddress(e.target.value)}
                    className="border rounded px-4 py-2 w-full mb-2"
                  />
                  
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={heirPercentage}
                      onChange={(e) => setHeirPercentage(parseInt(e.target.value))}
                      className="w-full mr-4"
                    />
                    <span className="w-16 text-right">{heirPercentage}%</span>
                  </div>
                </div>
                <button
                  onClick={handleAddHeir}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                >
                  Add Heir
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'notes' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Secure Notes for Heirs</h3>
              <p className="text-gray-600 mb-4">
                Write private notes or messages for your heirs. These will be securely stored and 
                only accessible to designated heirs after the unlocking conditions are met.
              </p>
              
              <div className="mb-4">
                <textarea
                  placeholder="Enter your private notes or instructions for heirs..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="border rounded px-4 py-2 w-full h-40"
                />
              </div>
              
              <button
                onClick={handleSaveNotes}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Save Notes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaultManage;
