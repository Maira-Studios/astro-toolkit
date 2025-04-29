// src/components/results/HitCell.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AstroUtils from '../../utils/AstroUtils.js';

const HitCell = ({ hit, isVipreet = false, changeStatus = null, sourcePlanet, targetPosition, targetName }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const { t } = useTranslation();

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
    } else if (hit.type === 'beyond180') {
        bgColor = 'bg-gray-50'; // Gray for beyond 180 degrees
    }

    // Override background for comparison mode
    if (changeStatus === 'improved') {
        bgColor = 'bg-green-200';
    } else if (changeStatus === 'worsened') {
        bgColor = 'bg-red-200';
    }

    // Get standard orb for an aspect
    const getStandardOrb = (aspectDegree) => {
        // Find the aspect in the AstroUtils aspects
        for (const aspectType in AstroUtils.aspects) {
            const aspect = AstroUtils.aspects[aspectType].find(a => a.degree === aspectDegree);
            if (aspect) {
                return aspect.orb;
            }
        }
        return 0;
    };

    // Determine tooltip content
    const getTooltipContent = () => {
        console.log(
            'Tooltip values →',
            'source:', sourcePlanet.position, typeof sourcePlanet.position,
            'target:', targetPosition, typeof targetPosition
        );
        const angleDiff = AstroUtils.calculateAngleDifference(sourcePlanet.position, targetPosition);

        // Format for beyond 180 degrees hits
        if (hit.type === 'beyond180') {
            return `${sourcePlanet.name} (${sourcePlanet.position.toFixed(2)}°) - ${targetName} (${targetPosition.toFixed(2)}°) = ${angleDiff.toFixed(2)}°\n…`;
        }

        // Format for regular hits
        const diffText = `${sourcePlanet.name} (${sourcePlanet.position.toFixed(2)}°) - ${targetName} (${targetPosition.toFixed(2)}°) = ${angleDiff.toFixed(2)}°`;

        let hitTypeText;
        if (hit.type === 'positive') {
            hitTypeText = t('hits.positive');
        } else if (hit.type === 'negative') {
            if (isVipreet) {
                hitTypeText = t('hits.vipreet');
            } else {
                hitTypeText = t('hits.negative');
            }
        } else {
            hitTypeText = t('tooltips.noHit');
        }

        // Get the standard orb for this aspect
        const standardOrb = getStandardOrb(hit.aspect);
        let reasonText = `${t('hits.reason')} = ${hit.aspect}° ${t('hits.aspect')} (± ${standardOrb}° ${t('hits.orb')})`;

        let additionalInfo = '';
        if (changeStatus) {
            additionalInfo = "\n" + (changeStatus === 'improved'
                ? "This aspect has improved from the original chart"
                : "This aspect has worsened from the original chart");
        }

        return `${diffText}\n${t('hits.hit')} = ${hitTypeText}\n${reasonText}${additionalInfo}`;
    };

    // Determine what to display based on hit type
    const displayValue = () => {
        if (hit.type === 'none' || hit.type === 'beyond180') {
            return <span className="text-gray-500">NA</span>;
        }

        // Show only the aspect angle without the orb value
        let displayAngle = `${hit.aspect}°`;

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
        <td
            className={`px-4 py-2 border text-center ${bgColor} relative`}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {displayValue()}

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

export default HitCell;