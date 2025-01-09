import React, { useState } from "react";

function MintNFT({ contract, account }) {
    const [collectionId, setCollectionId] = useState("");
    const [nftName, setNftName] = useState("");

    const mintNFT = async () => {
        try {
            const result = await contract.methods
                .mintNFT(collectionId, nftName)
                .send({ from: account });
            alert(`NFT Minted! Token ID: ${result.events.NFTMinted.returnValues.tokenId}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 my-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Mint NFT
            </h2>
            <input
                type="text"
                placeholder="Collection ID"
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="text"
                placeholder="NFT Name"
                value={nftName}
                onChange={(e) => setNftName(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={mintNFT}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
            >
                Mint NFT
            </button>
        </div>
    );
}

export default MintNFT;
