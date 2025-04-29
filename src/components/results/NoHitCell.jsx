// src/components/results/NoHitCell.jsx
import React, { useState } from 'react';
import AstroUtils from '../../utils/AstroUtils.js';

const NoHitCell = ({ changeStatus, sourcePlanet, targetPosition, targetName }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    // Set the background color based on the change status
    let bgColor = 'bg-white';
    if (changeStatus === 'improved') {
        bgColor = 'bg-green-100';
    } else if (changeStatus === 'worsened') {
        bgColor = 'bg-red-100';
    }
    // Determine tooltip content
    const getTooltipContent = () => {
        // 1. Compute the raw angle difference
        const angleDiff = AstroUtils.calculateAngleDifference(
            sourcePlanet.position,
            targetPosition
        );

        // 2. Normalize both values to numbers
        const srcVal = typeof sourcePlanet.position === 'number'
            ? sourcePlanet.position
            : AstroUtils.parsePosition(sourcePlanet.position);
        const tgtVal = typeof targetPosition === 'number'
            ? targetPosition
            : AstroUtils.parsePosition(targetPosition);

        // 3. Build the diff text with two-decimal formatting
        const diffText = `${sourcePlanet.name} (${srcVal.toFixed(2)}°) - ` +
            `${targetName} (${tgtVal.toFixed(2)}°) = ` +
            `${angleDiff.toFixed(2)}°`;

        // 4. Reason for no hit
        const reasonText = `No hit because ${angleDiff.toFixed(2)}° ` +
            `does not match any aspect pattern`;

        // 5. Include comparison info if present
        let additionalInfo = '';
        if (changeStatus) {
            additionalInfo = changeStatus === 'improved'
                ? "\nThis is an improvement from the original chart"
                : "\nThis is a regression from the original chart";
        }

        return `${diffText}\n${reasonText}${additionalInfo}`;
    };


    return (
        <td
            className={`px-4 py-2 border text-center ${bgColor} relative`}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <span className="text-gray-500">NA</span>

            {showTooltip && (
                <div className="absolute z-10 w-64 p-2 bg-black text-white text-xs rounded shadow-lg whitespace-pre-line"
                    style={{
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginBottom: '5px'
                    }}
                >
                    {getTooltipContent()}
                    <div className="absolute w-2 h-2 bg-black transform rotate-45"
                        style={{
                            bottom: '-4px',
                            left: '50%',
                            marginLeft: '-4px'
                        }}
                    ></div>
                </div>
            )}
        </td>
    );
};

export default NoHitCell;