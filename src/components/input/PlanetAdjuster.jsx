// src/components/input/PlanetAdjuster.js
import React from 'react';
import AstroUtils from '../../utils/AstroUtils';

const PlanetAdjuster = ({ planets, houses, onPlanetAdjusted }) => {
    const handleSliderChange = (planetId, value) => {
        const position = AstroUtils.formatPosition(value);
        onPlanetAdjusted(planetId, position);
    };

    return (
        <div className="space-y-6">
            <p className="text-sm text-gray-600 mb-4">
                Drag the sliders to adjust planet positions. Houses are marked as reference points.
            </p>

            {planets.filter(p => p.canHit).map(planet => (
                <div key={planet.id} className="mb-8">
                    <div className="flex items-center mb-1">
                        <span className="font-medium">{planet.name}:{planet.position}</span>
                    </div>

                    <div className="relative h-16">
                        {/* Degree markers */}
                        <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                            <span>0°</span>
                            <span>90°</span>
                            <span>180°</span>
                            <span>270°</span>
                            <span>360°</span>
                        </div>

                        {/* Single continuous slider track */}
                        <div className="absolute h-2 bg-gray-200 left-0 right-0 top-8 rounded-full"></div>

                        {/* House number markers */}
                        {houses.map(house => (
                            <div
                                key={`house-${house.number}`}
                                className="absolute h-6 w-0.5 bg-gray-400 top-6"
                                style={{ left: `${(AstroUtils.parsePosition(house.position) / 360) * 100}%` }}
                            >
                                <div className="absolute bottom-6 transform -translate-x-1/2 text-xs text-gray-600">
                                    {house.number}
                                </div>
                            </div>
                        ))}

                        {/* ONLY the main planet slider dot - large and prominent */}
                        <div
                            className="absolute h-8 w-8 bg-blue-600 rounded-full shadow-md top-5 transform -translate-x-1/2 cursor-grab"
                            style={{
                                left: `${(AstroUtils.parsePosition(planet.position) / 360) * 100}%`,
                            }}
                        ></div>

                        {/* The actual range input - invisible but captures events */}
                        <input
                            type="range"
                            min="0"
                            max="359.99"
                            step="0.01"
                            value={AstroUtils.parsePosition(planet.position)}
                            onChange={(e) => handleSliderChange(planet.id, parseFloat(e.target.value))}
                            className="absolute w-full h-10 top-4 opacity-0 cursor-pointer"
                            style={{ zIndex: 30 }}
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