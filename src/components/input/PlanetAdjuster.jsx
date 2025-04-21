// src/components/input/PlanetAdjuster.jsx
import React from 'react';
import AstroUtils from '../../utils/AstroUtils';

const PlanetAdjuster = ({ planets, houses, onPlanetAdjusted }) => {
    // Function to handle slider change
    const handleSliderChange = (planetId, value) => {
        const position = AstroUtils.formatPosition(value);
        onPlanetAdjusted(planetId, position);
    };

    // Function to snap planet to nearest house cusp
    const snapToHouse = (planetId, houseNumber) => {
        const house = houses.find(h => h.number === houseNumber);
        if (house) {
            onPlanetAdjusted(planetId, house.position);
        }
    };

    return (
        <div className="space-y-6 px-2">
            <p className="text-sm text-gray-600 mb-6">
                Drag sliders to adjust planet positions or click a house number to snap to that cusp.
            </p>

            {planets.filter(p => p.canHit).map(planet => (
                <div key={planet.id} className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{planet.name}: {planet.position}</span>
                    </div>

                    {/* Simplified slider with direct HTML input range */}
                    <div className="relative pt-5 pb-8">
                        {/* Degree markers - just 0, 90, 180, 270, 360 */}
                        <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                            <span>0°</span>
                            <span>90°</span>
                            <span>180°</span>
                            <span>270°</span>
                            <span>360°</span>
                        </div>

                        {/* House numbers as clickable buttons */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                            {houses.map(house => (
                                <button
                                    key={`house-btn-${house.number}`}
                                    className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs hover:bg-blue-200 focus:outline-none"
                                    style={{
                                        position: 'absolute',
                                        left: `${(AstroUtils.parsePosition(house.position) / 360) * 100}%`,
                                        transform: 'translateX(-50%)'
                                    }}
                                    onClick={() => snapToHouse(planet.id, house.number)}
                                    title={`${house.number}: ${AstroUtils.formatDegree(house.position)}`}
                                >
                                    {house.number}
                                </button>
                            ))}
                        </div>

                        {/* Simple slider track */}
                        <div className="h-2 bg-gray-200 rounded-full mt-1"></div>

                        {/* Actual range input - made visible for better UX */}
                        <input
                            type="range"
                            min="0"
                            max="359.99"
                            step="0.01"
                            value={AstroUtils.parsePosition(planet.position)}
                            onChange={(e) => handleSliderChange(planet.id, parseFloat(e.target.value))}
                            className="absolute top-6 left-0 w-full h-6 appearance-none bg-transparent"
                            style={{
                                // Custom styles for the thumb to make it more visible and grabbable
                                WebkitAppearance: 'none',
                                cursor: 'pointer'
                            }}
                        />

                        {/* Custom thumb appearance */}
                        <div
                            className="absolute w-6 h-6 bg-blue-600 rounded-full shadow pointer-events-none"
                            style={{
                                top: '6px',
                                left: `calc(${(AstroUtils.parsePosition(planet.position) / 360) * 100}% - 12px)`,
                            }}
                        />
                    </div>
                </div>
            ))}

            <div className="mt-6">
                <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    onClick={() => planets.filter(p => p.canHit).forEach(p =>
                        onPlanetAdjusted(p.id, p.originalPosition || p.position)
                    )}
                >
                    Reset All
                </button>
            </div>
        </div>
    );
};

export default PlanetAdjuster;