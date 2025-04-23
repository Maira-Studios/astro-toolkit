// src/components/results/ResultsTable.jsx
import React, { useState } from 'react';
import AstroUtils from '../../utils/AstroUtils.js';
import HitCell from './HitCell.jsx';
import NoHitCell from './NoHitCell.jsx';

const ResultsTable = ({ planets, houses, mode, originalPlanets = [], relationshipType = 'planet-house' }) => {
    // State for showing tooltips on self-position cells
    const [showTooltip, setShowTooltip] = useState(null);

    // Filter out non-hitting planets
    const hittingPlanets = planets.filter(planet => planet.canHit);

    // Function to determine hit type between planet and house or planet
    const determineHit = (sourcePlanet, targetPosition) => {
        const angleDiff = AstroUtils.calculateAngleDifference(sourcePlanet.position, targetPosition);
        return AstroUtils.determineHitType(angleDiff);
    };

    // Function to determine if hit status changed for comparison view
    const determineHitChange = (sourcePlanet, targetPosition) => {
        if (mode !== 'comparison' || originalPlanets.length === 0) return null;

        const originalPlanet = originalPlanets.find(p => p.id === sourcePlanet.id);
        if (!originalPlanet) return null;

        const originalHit = AstroUtils.determineHitType(
            AstroUtils.calculateAngleDifference(originalPlanet.position, targetPosition)
        );

        const currentHit = AstroUtils.determineHitType(
            AstroUtils.calculateAngleDifference(sourcePlanet.position, targetPosition)
        );

        if (originalHit.type === 'negative' && currentHit.type === 'positive') {
            return 'improved';
        } else if (originalHit.type === 'positive' && currentHit.type === 'negative') {
            return 'worsened';
        } else if (originalHit.type === 'none' && currentHit.type !== 'none') {
            return currentHit.type === 'positive' ? 'improved' : 'worsened';
        } else if (originalHit.type !== 'none' && currentHit.type === 'none') {
            return originalHit.type === 'negative' ? 'improved' : 'worsened';
        }

        return null;
    };

    // Function to find planets in the same cusp
    const getPlanetsInSameCusp = (planet) => {
        const planetPos = AstroUtils.parsePosition(planet.position);

        // Find which cusp this planet is in
        const planetCusp = houses.find(house => {
            const housePos = AstroUtils.parsePosition(house.position);
            return Math.abs(planetPos - housePos) <= 5; // Consider 5 degree orb for cusp placement
        });

        if (!planetCusp) return [];

        // Find other planets in the same cusp
        return planets.filter(p =>
            p.id !== planet.id &&
            Math.abs(AstroUtils.parsePosition(p.position) - AstroUtils.parsePosition(planetCusp.position)) <= 5
        );
    };

    // Render Planet → House table
    if (relationshipType === 'planet-house') {
        return (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="sticky left-0 bg-gray-100 px-4 py-2 border">Planet/Target</th>
                            {houses.map(house => (
                                <th key={`house-${house.number}`} className="px-4 py-2 border text-center whitespace-nowrap">
                                    Cusp {house.number}<br />
                                    <span className="text-xs text-gray-500">{AstroUtils.formatDegree(house.position)}</span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {hittingPlanets.map(planet => (
                            <tr key={`planet-${planet.id}`}>
                                <td className="sticky left-0 bg-white px-4 py-2 border font-medium whitespace-nowrap">
                                    {planet.name}<br />
                                    <span className="text-xs text-gray-500">{AstroUtils.formatDegree(planet.position)}</span>
                                </td>
                                {houses.map(house => {
                                    // Skip hits for a planet on its own cusp
                                    if (AstroUtils.isInSamePosition(planet.position, house.position)) {
                                        // Check if there are other planets in this cusp
                                        const otherPlanetsInCusp = getPlanetsInSameCusp(planet);

                                        return (
                                            <td
                                                key={`self-${planet.id}-house-${house.number}`}
                                                className="px-4 py-2 border text-center bg-gray-100 relative"
                                                onMouseEnter={() => setShowTooltip(`self-${planet.id}-house-${house.number}`)}
                                                onMouseLeave={() => setShowTooltip(null)}
                                            >
                                                -
                                                {showTooltip === `self-${planet.id}-house-${house.number}` && (
                                                    <div className="absolute z-10 w-64 p-2 bg-black text-white text-xs rounded shadow-lg whitespace-pre-line"
                                                        style={{
                                                            bottom: '100%',
                                                            left: '50%',
                                                            transform: 'translateX(-50%)',
                                                            marginBottom: '5px'
                                                        }}
                                                    >
                                                        {otherPlanetsInCusp.length > 0
                                                            ? `No hit because ${planet.name} and ${otherPlanetsInCusp.map(p => p.name).join(', ')} are both in the same cusp ${house.number}`
                                                            : `No hit because ${planet.name} is positioned in cusp ${house.number}`
                                                        }
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
                                    }

                                    const hit = determineHit(planet, house.position);
                                    const hitChange = determineHitChange(planet, house.position);

                                    return hit.type !== 'none' ? (
                                        <HitCell
                                            key={`hit-${planet.id}-house-${house.number}`}
                                            hit={hit}
                                            isVipreet={AstroUtils.isVipreetHit(hit.type, house.number)}
                                            changeStatus={hitChange}
                                            sourcePlanet={planet}
                                            targetPosition={house.position}
                                            targetName={`Cusp ${house.number}`}
                                        />
                                    ) : (
                                        <NoHitCell
                                            key={`nohit-${planet.id}-house-${house.number}`}
                                            changeStatus={hitChange}
                                            sourcePlanet={planet}
                                            targetPosition={house.position}
                                            targetName={`Cusp ${house.number}`}
                                        />
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    // Render Planet → Planet table
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="sticky left-0 bg-gray-100 px-4 py-2 border">Planet/Target</th>
                        {planets.filter(p => p.id !== 'asc').map(targetPlanet => (
                            <th key={`target-${targetPlanet.id}`} className="px-4 py-2 border text-center whitespace-nowrap">
                                {targetPlanet.name}<br />
                                <span className="text-xs text-gray-500">{AstroUtils.formatDegree(targetPlanet.position)}</span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {hittingPlanets.filter(p => p.id !== 'asc').map(sourcePlanet => (
                        <tr key={`source-${sourcePlanet.id}`}>
                            <td className="sticky left-0 bg-white px-4 py-2 border font-medium whitespace-nowrap">
                                {sourcePlanet.name}<br />
                                <span className="text-xs text-gray-500">{AstroUtils.formatDegree(sourcePlanet.position)}</span>
                            </td>
                            {planets.filter(p => p.id !== 'asc').map(targetPlanet => {
                                // Skip self-relationships
                                if (sourcePlanet.id === targetPlanet.id) {
                                    return (
                                        <td
                                            key={`self-${sourcePlanet.id}-${targetPlanet.id}`}
                                            className="px-4 py-2 border text-center bg-gray-100"
                                        >
                                            -
                                        </td>
                                    );
                                }

                                // Skip planets in the same position with tooltip
                                if (AstroUtils.isInSamePosition(sourcePlanet.position, targetPlanet.position)) {
                                    // Check if they share the same cusp
                                    return (
                                        <td
                                            key={`same-pos-${sourcePlanet.id}-${targetPlanet.id}`}
                                            className="px-4 py-2 border text-center bg-gray-100 relative"
                                            onMouseEnter={() => setShowTooltip(`same-pos-${sourcePlanet.id}-${targetPlanet.id}`)}
                                            onMouseLeave={() => setShowTooltip(null)}
                                        >
                                            -
                                            {showTooltip === `same-pos-${sourcePlanet.id}-${targetPlanet.id}` && (
                                                <div className="absolute z-10 w-64 p-2 bg-black text-white text-xs rounded shadow-lg whitespace-pre-line"
                                                    style={{
                                                        bottom: '100%',
                                                        left: '50%',
                                                        transform: 'translateX(-50%)',
                                                        marginBottom: '5px'
                                                    }}
                                                >
                                                    {`No hit because ${sourcePlanet.name} and ${targetPlanet.name} are in the same position (conjunction)`}
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
                                }

                                const hit = determineHit(sourcePlanet, targetPlanet.position);
                                const hitChange = determineHitChange(sourcePlanet, targetPlanet.position);

                                return hit.type !== 'none' ? (
                                    <HitCell
                                        key={`hit-${sourcePlanet.id}-planet-${targetPlanet.id}`}
                                        hit={hit}
                                        isVipreet={false} // No vipreet concept for planet-to-planet
                                        changeStatus={hitChange}
                                        sourcePlanet={sourcePlanet}
                                        targetPosition={targetPlanet.position}
                                        targetName={targetPlanet.name}
                                    />
                                ) : (
                                    <NoHitCell
                                        key={`nohit-${sourcePlanet.id}-planet-${targetPlanet.id}`}
                                        changeStatus={hitChange}
                                        sourcePlanet={sourcePlanet}
                                        targetPosition={targetPlanet.position}
                                        targetName={targetPlanet.name}
                                    />
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResultsTable;