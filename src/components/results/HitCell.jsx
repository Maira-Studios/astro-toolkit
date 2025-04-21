// src/components/results/HitCell.js
import React, { useState } from 'react';
import AstroUtils from '../../utils/AstroUtils';
import NoHitCell from './NoHitCell';

const HitCell = ({
    angleDiff,
    hitInfo,
    isVipreet,

    sourceName,
    sourcePosition,

    targetName,
    targetPosition
}) => {
    const [showTooltip, setShowTooltip] = useState(false);

    // Special case for beyond 180 degrees
    if (hitInfo.type === "beyond180") {
        return (
            <td className="border border-gray-300 p-2 text-center relative bg-gray-100">
                <NoHitCell
                    reason="beyond180"
                    sourceName={sourceName}
                    sourcePosition={sourcePosition}
                    targetName={targetName}
                    targetPosition={targetPosition}
                />
            </td>
        );
    }

    // For non-hit cells
    if (hitInfo.type === "none") {
        return (
            <td
                className="border border-gray-300 p-2 text-center relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <span>{Math.floor(angleDiff)}°</span>

                {showTooltip && (
                    <div className="absolute z-20 bg-black text-white text-xs rounded p-2 w-64 left-1/2 transform -translate-x-1/2 bottom-full mb-1">
                        <div className="font-bold mb-1">
                            {sourceName} ({AstroUtils.formatDegree(sourcePosition)}) ↔ {targetName} ({AstroUtils.formatDegree(targetPosition)})
                        </div>
                        <div>Angle: {angleDiff.toFixed(2)}°</div>
                        <div>Not a valid aspect - must be one of the following with allowed orb:</div>
                        <div className="grid grid-cols-2 gap-1 mt-1">
                            <div>30° ± 3°</div>
                            <div>45° ± 3°</div>
                            <div>60° ± 5°</div>
                            <div>90° ± 5°</div>
                            <div>120° ± 8°</div>
                            <div>180° ± 8°</div>
                        </div>
                        <div className="w-3 h-3 bg-black absolute left-1/2 transform -translate-x-1/2 rotate-45 -bottom-1"></div>
                    </div>
                )}
            </td>
        );
    }

    // Determine CSS class for coloring
    let cellClass = "border border-gray-300 p-2 text-center relative";
    if (isVipreet) {
        cellClass += " bg-blue-200";
    } else if (hitInfo.type === "positive") {
        cellClass += " bg-green-200";
    } else if (hitInfo.type === "negative") {
        cellClass += " bg-red-200";
    }

    return (
        <td
            className={cellClass}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <span>
                {hitInfo.aspect}°
                {typeof hitInfo.orb === 'number' && hitInfo.orb > 0 && (
                    <span className="text-xs ml-1">±{hitInfo.orb}°</span>
                )}
                <span className="ml-1 font-bold">
                    {isVipreet ? "(V)" : hitInfo.type === "positive" ? "(+)" : "(-)"}
                </span>
            </span>

            {/* Enhanced tooltip using state instead of CSS hover */}
            {showTooltip && (
                <div className="absolute z-20 bg-black text-white text-xs rounded p-2 w-64 left-1/2 transform -translate-x-1/2 bottom-full mb-1">
                    <div className="font-bold mb-1">
                        {sourceName} ({AstroUtils.formatDegree(sourcePosition)}) ↔ {targetName} ({AstroUtils.formatDegree(targetPosition)})
                    </div>
                    <div>Exact angle: {angleDiff.toFixed(2)}°</div>
                    <div>Aspect: {hitInfo.aspect}° ({hitInfo.type})</div>
                    <div>
                        Orb: {hitInfo.orb}° (allowed:
                        {hitInfo.aspect === 30 || hitInfo.aspect === 45 ? " ±3°" :
                            hitInfo.aspect === 60 || hitInfo.aspect === 90 ? " ±5°" : " ±8°"})
                    </div>
                    {isVipreet && (
                        <div className="mt-1 text-blue-300">
                            Vipreet Raja Yoga: Negative aspect on house {targetName.split(' ')[1]} becomes positive
                        </div>
                    )}
                    <div className="w-3 h-3 bg-black absolute left-1/2 transform -translate-x-1/2 rotate-45 -bottom-1"></div>
                </div>
            )}
        </td>
    );
};

export default HitCell;