import React, { useState, useEffect } from "react";

function ViewCollections({ contract }) {
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        const fetchCollections = async () => {
            const creatorCollections = await contract.methods.creatorCollections().call();
            setCollections(creatorCollections);
        };
        fetchCollections();
    }, [contract]);

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 my-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                View Collections
            </h2>
            <ul className="divide-y divide-gray-300">
                {collections.map((collection, index) => (
                    <li
                        key={index}
                        className="py-2 flex justify-between items-center"
                    >
                        <span className="text-gray-700 font-medium">
                            {collection.name} (ID: {collection.collectionId})
                        </span>
                        <span className="text-gray-500">
                            Creator: {collection.creator}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ViewCollections;
