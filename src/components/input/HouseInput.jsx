// src/components/input/HouseInput.js
import React, { useState } from 'react';

const HouseInput = ({ house, onChange }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="flex items-center mb-3">
            <label className="w-32 text-sm font-medium">House {house.number}:</label>
            <input
                type="text"
                value={house.position}
                onChange={(e) => onChange(house.number, e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 w-32"
                placeholder="DDD-MM"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            />
            {showTooltip && (
                <div className="absolute left-0 top-8 bg-black text-white text-xs rounded p-2 w-48 z-10">
                    Enter position for House {house.number} in DDD-MM format (e.g., 115-51 means 115°51')
                </div>
            )}
        </div>
    );
};

export default HouseInput;