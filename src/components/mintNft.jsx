import React, { useState, useEffect } from 'react';
import { getContract, getCurrentAccount } from '../web3.js';

export default function MintNFT() {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [nftName, setNftName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const contract = await getContract();
        const account = await getCurrentAccount();
        const userCollections = await contract.methods.getCreatorCollections(account).call();
        
        // Convert BigInt values to strings for proper handling
        const processedCollections = userCollections.map(collection => ({
          ...collection,
          collectionId: collection.collectionId.toString(),
          // Convert any other BigInt fields if they exist
          id: collection.id ? collection.id.toString() : undefined
        }));
        
        console.log('Processed collections:', processedCollections);
        setCollections(processedCollections);
      } catch (err) {
        console.error('Error loading collections:', err);
        setError('Failed to load collections: ' + err.message);
      }
    };
    loadCollections();
  }, []);

  const handleCollectionChange = (e) => {
    const value = e.target.value;
    console.log('Selected collection:', value);
    setSelectedCollection(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCollection) {
      setError('Please select a collection');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const contract = await getContract();
      const account = await getCurrentAccount();
      
      // Convert back to BigInt if needed for the contract call
      const collectionIdBigInt = BigInt(selectedCollection);
      
      console.log('Minting NFT with:', {
        collectionId: selectedCollection,
        name: nftName,
        account: account
      });
      
      await contract.methods.mintNFT(collectionIdBigInt, nftName).send({ from: account });
      setSuccess('NFT minted successfully');
      
      setSelectedCollection('');
      setNftName('');
    } catch (err) {
      console.error('Minting error:', err);
      setError('Failed to mint NFT: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Mint NFT</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Collection ({collections.length} available)
          </label>
          <select
            value={selectedCollection}
            onChange={handleCollectionChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a collection</option>
            {collections.map((collection) => (
              <option 
                key={collection.collectionId} 
                value={collection.collectionId}
              >
                {collection.name} (ID: {collection.collectionId})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            NFT Name
          </label>
          <input
            type="text"
            value={nftName}
            onChange={(e) => setNftName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-500 text-sm">{success}</div>}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          disabled={loading || !selectedCollection}
        >
          {loading ? 'Minting...' : 'Mint NFT'}
        </button>
      </form>
    </div>
  );
}