// src/components/layout/Sidebar.jsx
import React from 'react';

const Sidebar = ({ position = 'right', title, onClose, children }) => {
    return (
        <div className={`bg-white w-96 shadow-lg h-screen overflow-y-auto flex flex-col ${position === 'right' ? 'border-l' : 'border-r'}`}>
            {/* Sidebar header with title and close button */}
            <div className="h-16 border-b px-4 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-lg font-medium">{title}</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Sidebar content */}
            <div className="flex-1 p-4 overflow-y-auto">
                {children}
            </div>
        </div>
    );
};

export default Sidebar;