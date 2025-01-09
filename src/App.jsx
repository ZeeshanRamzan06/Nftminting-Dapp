import React, { useEffect, useState } from "react";
import getWeb3 from "./web3";
import NFTMinterABI from "./contracts/contractABI.json";
import CreateCollection from "./components/CreateCollection";
import MintNFT from "./components/mintNft";
import ViewCollections from "./components/viewCollection";
import ViewNFTs from "./components/viewNft";

const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

function App() {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState("");

    useEffect(() => {
        const init = async () => {
            const web3Instance = await getWeb3();
            const accounts = await web3Instance.eth.getAccounts();
            const contractInstance = new web3Instance.eth.Contract(
                NFTMinterABI.abi,
                CONTRACT_ADDRESS
            );

            setWeb3(web3Instance);
            setAccount(accounts[0]);
            setContract(contractInstance);
        };

        init();
    }, []);

    return (
      <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
              NFT Minter Dashboard
          </h1>
          <CreateCollection contract={contract} account={account} />
          <MintNFT contract={contract} account={account} />
          <ViewCollections contract={contract} />
          <ViewNFTs contract={contract} account={account} />
      </div>
  </div>
    );
}

export default App;
