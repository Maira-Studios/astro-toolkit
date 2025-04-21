// src/components/input/PlanetInput.js
import React, { useState } from 'react';

const PlanetInput = ({ planet, onChange }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="flex items-center mb-3">
            <label className="w-32 text-sm font-medium">
                {planet.name}{!planet.canHit && '*'}:
            </label>
            <input
                type="text"
                value={planet.position}
                onChange={(e) => onChange(planet.id, e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 w-32"
                placeholder="DDD-MM"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            />
            {showTooltip && (
                <div className="absolute left-0 top-8 bg-black text-white text-xs rounded p-2 w-48 z-10">
                    Enter position for {planet.name} in DDD-MM format (e.g., 057-08 means 57°08')
                    {!planet.canHit && (
                        <div className="mt-1 text-yellow-300">
                            Note: {planet.name} can be hit by other planets but does not hit other planets or houses
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PlanetInput;