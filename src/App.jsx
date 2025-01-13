import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './contracts/contractABI.js';
import MintNFT from './components/mintNft.jsx';
import ViewCollection from './components/viewCollection.jsx';
import CreateCollection from './components/CreateCollection.jsx';
import ViewNFT from './components/viewNft.jsx';

export default function App() {
  const [currentView, setCurrentView] = useState('create');
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  // Check if user is on mobile device
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Get MetaMask deep link URL
  const getMetaMaskDeepLink = () => {
    const currentUrl = window.location.href;
    return `https://metamask.app.link/dapp/${currentUrl.replace(/^https?:\/\//, '')}`;
  };

  useEffect(() => {
    checkWalletConnection();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      setWalletConnected(false);
      setAccount('');
    } else {
      setAccount(accounts[0]);
      setWalletConnected(true);
    }
  };

  const checkWalletConnection = async () => {
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        const accounts = await web3Instance.eth.getAccounts();
        
        if (accounts.length > 0) {
          setWeb3(web3Instance);
          setAccount(accounts[0]);
          setWalletConnected(true);
          
          const contractInstance = new web3Instance.eth.Contract(
            CONTRACT_ABI,
            CONTRACT_ADDRESS
          );
          setContract(contractInstance);
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const handleDesktopConnection = async () => {
    try {
      const web3Instance = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      setWeb3(web3Instance);
      setAccount(accounts[0]);
      setWalletConnected(true);
      
      const contractInstance = new web3Instance.eth.Contract(
        CONTRACT_ABI,
        CONTRACT_ADDRESS
      );
      setContract(contractInstance);
    } catch (error) {
      console.error('Error in desktop connection:', error);
      throw error;
    }
  };

  const connectWallet = async () => {
    try {
      if (isMobile()) {
        // Mobile device handling
        if (window.ethereum) {
          // MetaMask is installed on mobile
          await handleDesktopConnection();
        } else {
          // Redirect to MetaMask mobile app
          window.location.href = getMetaMaskDeepLink();
          return;
        }
      } else {
        // Desktop handling
        if (window.ethereum) {
          await handleDesktopConnection();
        } else {
          alert('Please install MetaMask!');
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  const renderContent = () => {
    if (!walletConnected) {
      return (
        <div className="text-center">
          <button 
            onClick={connectWallet}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      );
    }

    const props = {
      web3,
      contract,
      account,
      contractAddress: CONTRACT_ADDRESS
    };

    switch (currentView) {
      case 'create':
        return <CreateCollection {...props} />;
      case 'mint':
        return <MintNFT  {...props} />;
      case 'viewCollections':
        return <ViewCollection {...props} />;
      case 'viewNFTs':
        return <ViewNFT {...props} />;
      default:
        return <CreateCollection {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">NFT Minter</h1>
            {walletConnected && (
              <div className="text-sm text-gray-600">
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      {walletConnected && (
        <nav className="bg-white shadow-sm mt-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-4 py-3 overflow-x-auto">
              <button
                onClick={() => setCurrentView('create')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'create'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Create Collection
              </button>
              <button
                onClick={() => setCurrentView('mint')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'mint'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Mint NFT
              </button>
              <button
                onClick={() => setCurrentView('viewCollections')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'viewCollections'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                View Collections
              </button>
              <button
                onClick={() => setCurrentView('viewNFTs')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'viewNFTs'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                View NFTs
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}