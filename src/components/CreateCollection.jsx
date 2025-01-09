import React, { useState } from "react";

function CreateCollection({ contract, account }) {
    const [collectionName, setCollectionName] = useState("");

    const createCollection = async () => {
        try {
            const result = await contract.methods
                .createCollection(collectionName)
                .send({ from: account });
            alert(`Collection Created! ID: ${result.events.CollectionCreated.returnValues.collectionId}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 my-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Create Collection
            </h2>
            <input
                type="text"
                placeholder="Enter Collection Name"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={createCollection}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
                Create Collection
            </button>
        </div>
    );
}

export default CreateCollection;
