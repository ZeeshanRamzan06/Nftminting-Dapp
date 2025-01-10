import { useState, useEffect } from 'react';
import { getContract, getCurrentAccount } from '../web3.js';

export default function ViewCollection() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const contract = await getContract();
      const account = await getCurrentAccount();
      const userCollections = await contract.methods.getCreatorCollections(account).call();
      
      // Process collections to handle BigInt and ensure proper data structure
      const processedCollections = userCollections.map(collection => ({
        ...collection,
        // Convert BigInt to string if it exists
        collectionId: collection.collectionId ? collection.collectionId.toString() : undefined,
        // Ensure other fields are properly mapped
        name: collection.name || 'Unnamed Collection',
        creator: collection.creator || account
      }));
      
      setCollections(processedCollections);
    } catch (err) {
      console.error("Error loading collections:", err);
      setError('Failed to load collections: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center text-gray-600">Loading collections...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Collections</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection, index) => {
          
          return (
            <div
              key={collection.collectionId || index}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold mb-2">
                {collection.name}
              </h3>
              <p className="text-gray-600 mb-4 font-semibold">
                Collection ID: {collection.collectionId}
              </p>
              <div className="text-sm text-gray-500 font-semibold">
                Creator: {collection.creator ? 
                  `${collection.creator.slice(0, 6)}...${collection.creator.slice(-4)}` :
                  'Unknown Creator'}
              </div>
            </div>
          );
        })}
      </div>

      {collections.length === 0 && !error && (
        <div className="text-center text-gray-600">
          No collections found. Create your first collection!
        </div>
      )}

      
    </div>
  );
}