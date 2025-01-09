import React, { useState, useEffect } from "react";

function ViewNFTs({ contract, account }) {
    const [nfts, setNFTs] = useState([]);

    useEffect(() => {
        const fetchNFTs = async () => {
            const ownedNFTs = await contract.methods.getNFTsByOwner(account).call();
            setNFTs(ownedNFTs);
        };
        fetchNFTs();
    }, [contract, account]);

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 my-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your NFTs</h2>
            <ul className="divide-y divide-gray-300">
                {nfts.map((nft, index) => (
                    <li
                        key={index}
                        className="py-2 flex justify-between items-center"
                    >
                        <span className="text-gray-700 font-medium">
                            {nft.name} (Token ID: {nft.tokenId})
                        </span>
                        <span className="text-gray-500">
                            Collection: {nft.collectionName}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ViewNFTs;
