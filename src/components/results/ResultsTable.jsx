// src/components/results/ResultsTable.js
import React from 'react';
import AstroUtils from '../../utils/AstroUtils';
import HitCell from './HitCell';
import NoHitCell from './NoHitCell';

const ResultsTable = ({ planets, houses, mode, originalPlanets }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2 bg-gray-100">Planet/Target</th>
                        {houses.map(house => (
                            <th key={`house-${house.number}`} className="border border-gray-300 p-2 bg-gray-100">
                                House {house.number}
                                <div className="text-xs font-normal mt-1">
                                    {AstroUtils.formatDegree(house.position)}
                                </div>
                            </th>
                        ))}
                        {planets.map(planet => (
                            <th key={`planet-${planet.id}`} className="border border-gray-300 p-2 bg-gray-100">
                                {planet.name}
                                <div className="text-xs font-normal mt-1">
                                    {AstroUtils.formatDegree(planet.position)}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {planets.map(planet => (
                        <tr key={`row-${planet.id}`}>
                            <td className="border border-gray-300 p-2 font-bold bg-gray-50">
                                {planet.name}
                                {!planet.canHit && <span className="text-xs text-gray-500">*</span>}
                                <div className="text-xs font-normal mt-1">
                                    {AstroUtils.formatDegree(planet.position)}
                                </div>
                            </td>

                            {/* Planet to House hits */}
                            {houses.map(house => {
                                // Skip calculation if the planet can't hit
                                if (!planet.canHit) {
                                    return (
                                        <td
                                            key={`house-${house.number}`}
                                            className="border border-gray-300 p-2 bg-gray-100 text-center relative"
                                        >
                                            <NoHitCell
                                                reason="noHitPlanet"
                                                sourceName={planet.name}
                                                sourcePosition={planet.position}
                                                targetName={`House ${house.number}`}
                                                targetPosition={house.position}
                                            />
                                        </td>
                                    );
                                }

                                // Check if planet is sitting in the house
                                if (AstroUtils.isInHouse(planet.position, house.position)) {
                                    return (
                                        <td
                                            key={`house-${house.number}`}
                                            className="border border-gray-300 p-2 bg-gray-100 text-center relative"
                                        >
                                            <NoHitCell
                                                reason="inHouse"
                                                sourceName={planet.name}
                                                sourcePosition={planet.position}
                                                targetName={`House ${house.number}`}
                                                targetPosition={house.position}
                                            />
                                        </td>
                                    );
                                }

                                // Check if house is beyond 8th from planet (9th to 12th)
                                if (AstroUtils.isBeyondEighthHouse(planet.position, house.position)) {
                                    return (
                                        <td
                                            key={`house-${house.number}`}
                                            className="border border-gray-300 p-2 bg-gray-100 text-center relative"
                                        >
                                            <NoHitCell
                                                reason="beyond8th"
                                                sourceName={planet.name}
                                                sourcePosition={planet.position}
                                                targetName={`House ${house.number}`}
                                                targetPosition={house.position}
                                            />
                                        </td>
                                    );
                                }

                                const angleDiff = AstroUtils.calculateAngleDifference(planet.position, house.position);
                                const hitInfo = AstroUtils.determineHitType(angleDiff);
                                const isVipreet = AstroUtils.isVipreetHit(hitInfo.type, house.number);

                                // For comparison mode, add special styling
                                if (mode === 'comparison' && originalPlanets) {
                                    const originalPlanet = originalPlanets.find(p => p.id === planet.id);
                                    if (originalPlanet) {
                                        const originalAngleDiff = AstroUtils.calculateAngleDifference(originalPlanet.position, house.position);
                                        const originalHitInfo = AstroUtils.determineHitType(originalAngleDiff);
                                        const originalIsVipreet = AstroUtils.isVipreetHit(originalHitInfo.type, house.number);

                                        // Highlight changes
                                        if (hitInfo.type !== originalHitInfo.type || (isVipreet !== originalIsVipreet)) {
                                            if ((hitInfo.type === "positive" || isVipreet) &&
                                                (originalHitInfo.type === "negative" && !originalIsVipreet)) {
                                                // Improved: negative to positive
                                                return (
                                                    <td key={`house-${house.number}`} className="border border-gray-300 p-2 text-center relative bg-green-300">
                                                        <HitCell
                                                            angleDiff={angleDiff}
                                                            hitInfo={hitInfo}
                                                            isVipreet={isVipreet}
                                                            sourceType="planet"
                                                            sourceName={planet.name}
                                                            sourcePosition={planet.position}
                                                            targetType="house"
                                                            targetName={`House ${house.number}`}
                                                            targetPosition={house.position}
                                                        />
                                                    </td>
                                                );
                                            } else if ((hitInfo.type === "negative" && !isVipreet) &&
                                                (originalHitInfo.type === "positive" || originalIsVipreet)) {
                                                // Worsened: positive to negative
                                                return (
                                                    <td key={`house-${house.number}`} className="border border-gray-300 p-2 text-center relative bg-red-300">
                                                        <HitCell
                                                            angleDiff={angleDiff}
                                                            hitInfo={hitInfo}
                                                            isVipreet={isVipreet}
                                                            sourceType="planet"
                                                            sourceName={planet.name}
                                                            sourcePosition={planet.position}
                                                            targetType="house"
                                                            targetName={`House ${house.number}`}
                                                            targetPosition={house.position}
                                                        />
                                                    </td>
                                                );
                                            }
                                        }
                                    }
                                }

                                return (
                                    <HitCell
                                        key={`house-${house.number}`}
                                        angleDiff={angleDiff}
                                        hitInfo={hitInfo}
                                        isVipreet={isVipreet}
                                        sourceType="planet"
                                        sourceName={planet.name}
                                        sourcePosition={planet.position}
                                        targetType="house"
                                        targetName={`House ${house.number}`}
                                        targetPosition={house.position}
                                    />
                                );
                            })}

                            {/* Planet to Planet hits */}
                            {planets.map(targetPlanet => {
                                // Don't calculate for the same planet
                                if (planet.id === targetPlanet.id) {
                                    return (
                                        <td
                                            key={`planet-${targetPlanet.id}`}
                                            className="border border-gray-300 p-2 bg-gray-200 text-center"
                                        >
                                            -
                                        </td>
                                    );
                                }

                                // Skip calculation if the planet can't hit
                                if (!planet.canHit) {
                                    return (
                                        <td
                                            key={`planet-${targetPlanet.id}`}
                                            className="border border-gray-300 p-2 bg-gray-100 text-center relative"
                                        >
                                            <NoHitCell
                                                reason="noHitPlanet"
                                                sourceName={planet.name}
                                                sourcePosition={planet.position}
                                                targetName={targetPlanet.name}
                                                targetPosition={targetPlanet.position}
                                            />
                                        </td>
                                    );
                                }

                                const angleDiff = AstroUtils.calculateAngleDifference(planet.position, targetPlanet.position);
                                const hitInfo = AstroUtils.determineHitType(angleDiff);

                                // For comparison mode, add special styling
                                if (mode === 'comparison' && originalPlanets) {
                                    const originalPlanet = originalPlanets.find(p => p.id === planet.id);
                                    const originalTargetPlanet = originalPlanets.find(p => p.id === targetPlanet.id);

                                    if (originalPlanet && originalTargetPlanet) {
                                        const originalAngleDiff = AstroUtils.calculateAngleDifference(originalPlanet.position, originalTargetPlanet.position);
                                        const originalHitInfo = AstroUtils.determineHitType(originalAngleDiff);

                                        // Highlight changes
                                        if (hitInfo.type !== originalHitInfo.type) {
                                            if (hitInfo.type === "positive" && originalHitInfo.type !== "positive") {
                                                // Improved: non-positive to positive
                                                return (
                                                    <td key={`planet-${targetPlanet.id}`} className="border border-gray-300 p-2 text-center relative bg-green-300">
                                                        <HitCell
                                                            angleDiff={angleDiff}
                                                            hitInfo={hitInfo}
                                                            isVipreet={false}
                                                            sourceType="planet"
                                                            sourceName={planet.name}
                                                            sourcePosition={planet.position}
                                                            targetType="planet"
                                                            targetName={targetPlanet.name}
                                                            targetPosition={targetPlanet.position}
                                                        />
                                                    </td>
                                                );
                                            } else if (hitInfo.type === "negative" && originalHitInfo.type === "positive") {
                                                // Worsened: positive to negative
                                                return (
                                                    <td key={`planet-${targetPlanet.id}`} className="border border-gray-300 p-2 text-center relative bg-red-300">
                                                        <HitCell
                                                            angleDiff={angleDiff}
                                                            hitInfo={hitInfo}
                                                            isVipreet={false}
                                                            sourceType="planet"
                                                            sourceName={planet.name}
                                                            sourcePosition={planet.position}
                                                            targetType="planet"
                                                            targetName={targetPlanet.name}
                                                            targetPosition={targetPlanet.position}
                                                        />
                                                    </td>
                                                );
                                            }
                                        }
                                    }
                                }

                                return (
                                    <HitCell
                                        key={`planet-${targetPlanet.id}`}
                                        angleDiff={angleDiff}
                                        hitInfo={hitInfo}
                                        isVipreet={false} // No vipreet for planet-planet
                                        sourceType="planet"
                                        sourceName={planet.name}
                                        sourcePosition={planet.position}
                                        targetType="planet"
                                        targetName={targetPlanet.name}
                                        targetPosition={targetPlanet.position}
                                    />
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-2 text-xs text-gray-500">
                * Rahu and Ketu can be hit by other planets but do not hit other planets or houses
            </div>
        </div>
    );
};

export default ResultsTable;