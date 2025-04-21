// src/components/input/PlanetAdjuster.jsx
import React from 'react';
import AstroUtils from '../../utils/AstroUtils';

const PlanetAdjuster = ({ planets, houses, onPlanetAdjusted }) => {
    // Function to handle slider change
    const handleSliderChange = (planetId, value) => {
        const position = AstroUtils.formatPosition(value);
        onPlanetAdjusted(planetId, position);
    };

    return (
        <div className="space-y-6">
            <p className="text-sm text-gray-600 mb-4">
                Drag the sliders to adjust planet positions. Houses are marked as reference points.
            </p>

            {planets.filter(p => p.canHit).map(planet => {
                const currentPosition = AstroUtils.parsePosition(planet.position);

                return (
                    <div key={planet.id} className="mb-6">
                        <div className="flex justify-between mb-2">
                            <span className="font-medium">{planet.name}: {planet.position}</span>
                        </div>

                        {/* Standard HTML slider */}
                        <div className="slider-container">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>0°</span>
                                <span>90°</span>
                                <span>180°</span>
                                <span>270°</span>
                                <span>360°</span>
                            </div>

                            <input
                                type="range"
                                min="0"
                                max="359.99"
                                step="0.01"
                                value={currentPosition}
                                onChange={(e) => handleSliderChange(planet.id, parseFloat(e.target.value))}
                                className="w-full h-6 mb-4"
                            />

                            <div className="flex flex-wrap gap-1 mt-1">
                                {houses.map(house => (
                                    <button
                                        key={`house-${house.number}`}
                                        className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
                                        onClick={() => handleSliderChange(planet.id, AstroUtils.parsePosition(house.position))}
                                    >
                                        House {house.number}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}

            <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={() => planets.filter(p => p.canHit).forEach(p =>
                    onPlanetAdjusted(p.id, p.originalPosition || p.position)
                )}
            >
                Reset All
            </button>
        </div>
    );
};

export default PlanetAdjuster;