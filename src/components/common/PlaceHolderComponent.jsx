
// src/components/common/PlaceholderComponent.js
import React from 'react';

const PlaceholderComponent = ({ title, message }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <p className="text-gray-600">{message}</p>
        </div>
    );
};

export default PlaceholderComponent;