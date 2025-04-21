// src/components/common/TabSelector.js
import React from 'react';

const TabSelector = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="flex border-b border-gray-300 mb-4">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === tab.id
                        ? 'bg-gray-100 border border-gray-300 border-b-0 rounded-t'
                        : 'text-gray-600 hover:text-gray-800'
                        }`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default TabSelector;