// src/components/results/NoHitCell.js
import React, { useState } from 'react';
import AstroUtils from '../../utils/AstroUtils';

const NoHitCell = ({
    reason,
    sourceName,
    sourcePosition,
    targetName,
    targetPosition
}) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <>
            <span className="text-gray-500">NA</span>

            {showTooltip && (
                <div className="absolute z-20 bg-black text-white text-xs rounded p-2 w-64 left-1/2 transform -translate-x-1/2 bottom-full mb-1">
                    <div className="font-bold mb-1">
                        {sourceName} ({AstroUtils.formatDegree(sourcePosition)}) ↔ {targetName} ({AstroUtils.formatDegree(targetPosition)})
                    </div>
                    {reason === "noHitPlanet" && (
                        <div>{sourceName} does not hit other planets or houses</div>
                    )}
                    {reason === "inHouse" && (
                        <div>{sourceName} is sitting in {targetName} (within 5°) - no hit calculated</div>
                    )}
                    {reason === "beyond180" && (
                        <div>Angle difference exceeds 180° - no hit calculated</div>
                    )}
                    {reason === "beyond8th" && (
                        <div>Houses beyond 8th from the planet (9th to 12th) do not receive hits</div>
                    )}
                    <div className="w-3 h-3 bg-black absolute left-1/2 transform -translate-x-1/2 rotate-45 -bottom-1"></div>
                </div>
            )}

            <div
                className="absolute inset-0"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            />
        </>
    );
};

export default NoHitCell;