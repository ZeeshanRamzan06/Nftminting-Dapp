import { useState, useEffect } from 'react';
import { getContract, getCurrentAccount } from '../web3.js';

export default function ViewNFT() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('owned'); // 'owned' or 'created'

  useEffect(() => {
    loadNFTs();
  }, [viewMode]);

  const loadNFTs = async () => {
    try {
      const contract = await getContract();
      const account = await getCurrentAccount();
      
      let userNfts;
      if (viewMode === 'owned') {
        userNfts = await contract.methods.getNFTsByOwner(account).call();
      } else {
        userNfts = await contract.methods.getNFTsByCollection(account).call();
      }

      // Process NFTs to handle BigInt values
      const processedNfts = userNfts.map(nft => ({
        ...nft,
        tokenId: nft.tokenId ? nft.tokenId.toString() : undefined,
        // Add any other BigInt fields that need conversion
        collectionId: nft.collectionId ? nft.collectionId.toString() : undefined
      }));
      
      setNfts(processedNfts);
    } catch (err) {
      console.error("Error loading NFTs:", err);
      setError('Failed to load NFTs: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center text-gray-600">Loading NFTs...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {viewMode === 'owned' ? 'Your Owned NFTs' : 'Your Created NFTs'}
        </h2>
        
        <div className="flex space-x-4">
          <button
            onClick={() => setViewMode('owned')}
            className={`px-4 py-2 rounded-md ${
              viewMode === 'owned'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Owned NFTs
          </button>
          <button
            onClick={() => setViewMode('created')}
            className={`px-4 py-2 rounded-md ${
              viewMode === 'created'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Created NFTs
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nfts.map((nft, index) => {
          return (
            <div
              key={nft.tokenId || index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">
                {nft.name || 'Unnamed NFT'}
              </h3>
              <p className="text-gray-600 mb-2">
                Token ID: {nft.tokenId}
              </p>
              <p className="text-gray-600 mb-4">
                Collection: {nft.collectionName || 'Unknown Collection'}
              </p>
              <div className="text-sm text-gray-500">
                Owner: {nft.owner ? 
                  `${nft.owner.slice(0, 6)}...${nft.owner.slice(-4)}` :
                  'Unknown Owner'}
              </div>
            </div>
          );
        })}
      </div>

      {nfts.length === 0 && !error && (
        <div className="text-center text-gray-600 mt-8 p-6 bg-gray-50 rounded-lg">
          {viewMode === 'owned' 
            ? "You don't own any NFTs yet. Start by purchasing your first NFT!"
            : "You haven't created any NFTs yet. Start by minting your first NFT!"}
        </div>
      )}
    </div>
  );
}