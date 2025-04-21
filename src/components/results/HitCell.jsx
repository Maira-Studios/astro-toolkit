// src/components/results/HitCell.jsx
import React from 'react';

const HitCell = ({ hit, isVipreet = false, changeStatus = null }) => {
    // Guard against undefined hit
    if (!hit) {
        return (
            <td className="px-4 py-2 border text-center bg-white">
                <span className="text-gray-500">Error</span>
            </td>
        );
    }

    // Determine cell background color
    let bgColor = 'bg-white';

    // Change background based on hit type and vipreet status
    if (hit.type === 'positive' || (hit.type === 'negative' && isVipreet)) {
        bgColor = 'bg-green-100';
    } else if (hit.type === 'negative' && !isVipreet) {
        bgColor = 'bg-red-100';
    }

    // Override background for comparison mode
    if (changeStatus === 'improved') {
        bgColor = 'bg-green-200';
    } else if (changeStatus === 'worsened') {
        bgColor = 'bg-red-200';
    }

    // Determine what to display based on hit type
    const displayValue = () => {
        if (hit.type === 'none' || hit.type === 'beyond180') {
            return <span className="text-gray-500">NA</span>;
        }

        let displayAngle = `${hit.aspect}°`;
        if (hit.orb > 0) {
            displayAngle += ` ±${hit.orb}°`;
        }

        // Symbol based on hit type and vipreet
        let symbol = hit.type === 'positive' ? '(+)' : '(-)';
        if (isVipreet) {
            // Flip the symbol for vipreet hits
            symbol = hit.type === 'negative' ? '(+)' : '(-)';
        }

        return (
            <>
                {displayAngle}
                <br />
                <span className={isVipreet ? 'text-blue-600' : (hit.type === 'positive' ? 'text-green-600' : 'text-red-600')}>
                    {symbol}
                </span>
            </>
        );
    };

    return (
        <td className={`px-4 py-2 border text-center ${bgColor}`}>
            {displayValue()}
        </td>
    );
};

export default HitCell;