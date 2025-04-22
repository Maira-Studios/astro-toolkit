// src/components/results/ResultsTable.jsx
import React from 'react';
import AstroUtils from '../../utils/AstroUtils';
import HitCell from './HitCell.jsx';
import NoHitCell from './NoHitCell.jsx';

const ResultsTable = ({ planets, houses, mode, originalPlanets = [], relationshipType = 'planet-house' }) => {
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
                                    const hit = determineHit(planet, house.position);
                                    const hitChange = determineHitChange(planet, house.position);

                                    return hit.type !== 'none' ? (
                                        <HitCell
                                            key={`hit-${planet.id}-house-${house.number}`}
                                            hit={hit}
                                            isVipreet={AstroUtils.isVipreetHit(hit.type, house.number)}
                                            changeStatus={hitChange}
                                        />
                                    ) : (
                                        <NoHitCell
                                            key={`nohit-${planet.id}-house-${house.number}`}
                                            changeStatus={hitChange}
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
                        {hittingPlanets.map(targetPlanet => (
                            <th key={`target-${targetPlanet.id}`} className="px-4 py-2 border text-center whitespace-nowrap">
                                {targetPlanet.name}<br />
                                <span className="text-xs text-gray-500">{AstroUtils.formatDegree(targetPlanet.position)}</span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {hittingPlanets.map(sourcePlanet => (
                        <tr key={`source-${sourcePlanet.id}`}>
                            <td className="sticky left-0 bg-white px-4 py-2 border font-medium whitespace-nowrap">
                                {sourcePlanet.name}<br />
                                <span className="text-xs text-gray-500">{AstroUtils.formatDegree(sourcePlanet.position)}</span>
                            </td>
                            {hittingPlanets.map(targetPlanet => {
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

                                const hit = determineHit(sourcePlanet, targetPlanet.position);
                                const hitChange = determineHitChange(sourcePlanet, targetPlanet.position);

                                return hit.type !== 'none' ? (
                                    <HitCell
                                        key={`hit-${sourcePlanet.id}-planet-${targetPlanet.id}`}
                                        hit={hit}
                                        isVipreet={false} // No vipreet concept for planet-to-planet
                                        changeStatus={hitChange}
                                    />
                                ) : (
                                    <NoHitCell
                                        key={`nohit-${sourcePlanet.id}-planet-${targetPlanet.id}`}
                                        changeStatus={hitChange}
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