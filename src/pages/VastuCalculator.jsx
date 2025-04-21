// src/pages/VastuCalculator.js
import React, { useState, useEffect } from 'react';

import ResultsTable from "../components/results/ResultsTable.jsx";
import TabSelector from '../components/common/TabSelector.jsx';
import PlanetInput from "../components/input/PlanetInput.jsx"
import HouseInput from "../components/input/HouseInput.jsx"
import PlanetAdjuster from "../components/input/PlanetAdjuster.jsx"



const VastuCalculator = () => {
    // State for planets and houses
    const [planets, setPlanets] = useState([
        { id: 'asc', name: 'Ascendant', position: '115-51', canHit: true },
        { id: 'sun', name: 'Sun', position: '057-08', canHit: true },
        { id: 'moon', name: 'Moon', position: '070-40', canHit: true },
        { id: 'mars', name: 'Mars', position: '054-49', canHit: true },
        { id: 'mercury', name: 'Mercury', position: '033-49', canHit: true },
        { id: 'jupiter', name: 'Jupiter', position: '220-39', canHit: true },
        { id: 'venus', name: 'Venus', position: '102-25', canHit: true },
        { id: 'saturn', name: 'Saturn', position: '184-30', canHit: true },
        { id: 'rahu', name: 'Rahu', position: '061-44', canHit: false },
        { id: 'ketu', name: 'Ketu', position: '241-44', canHit: false }
    ]);

    const [houses, setHouses] = useState([
        { number: 1, position: '115-51' },
        { number: 2, position: '140-53' },
        { number: 3, position: '169-57' },
        { number: 4, position: '202-19' },
        { number: 5, position: '235-18' },
        { number: 6, position: '266-40' },
        { number: 7, position: '295-51' },
        { number: 8, position: '320-53' },
        { number: 9, position: '349-57' },
        { number: 10, position: '022-19' },
        { number: 11, position: '055-18' },
        { number: 12, position: '086-40' }
    ]);

    // State for input section tabs
    const [activeInputTab, setActiveInputTab] = useState('planets');
    const inputTabs = [
        { id: 'planets', label: 'Planet Inputs' },
        { id: 'houses', label: 'House Inputs' },
        { id: 'adjust', label: 'Adjust Planets' }
    ];

    // State for results section tabs
    const [activeResultTab, setActiveResultTab] = useState('original');
    const resultTabs = [
        { id: 'original', label: 'Original Table' },
        { id: 'corrected', label: 'Corrected Table' },
        { id: 'comparison', label: 'Comparison' }
    ];

    // State for original planets (for comparison)
    const [originalPlanets, setOriginalPlanets] = useState([]);

    // State for calculation status
    const [isCalculated, setIsCalculated] = useState(false);

    // Handle planet position change
    const handlePlanetPositionChange = (id, position) => {
        setPlanets(planets.map(planet =>
            planet.id === id ? { ...planet, position } : planet
        ));
    };

    // Handle house position change
    const handleHousePositionChange = (number, position) => {
        setHouses(houses.map(house =>
            house.number === number ? { ...house, position } : house
        ));
    };

    // Handle planet adjustment
    const handlePlanetAdjustment = (id, position) => {
        setPlanets(planets.map(planet =>
            planet.id === id ? { ...planet, position } : planet
        ));
    };

    // Handle calculation
    const handleCalculate = () => {
        if (!isCalculated) {
            // Store the original planets for comparison
            setOriginalPlanets(planets.map(planet => ({ ...planet, originalPosition: planet.position })));
            setIsCalculated(true);
        } else {
            // If already calculated, just update the corrected state
            setActiveResultTab('corrected');
        }
    };

    // Effect to switch to corrected tab when adjusting planets after calculation
    useEffect(() => {
        if (isCalculated && activeInputTab === 'adjust') {
            setActiveResultTab('corrected');
        }
    }, [planets, isCalculated, activeInputTab]);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold mb-6">Astro Vastu Hit Table</h1>

            {/* Section 1: Inputs & Adjustments */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Data & Adjustments</h2>

                <TabSelector
                    tabs={inputTabs}
                    activeTab={activeInputTab}
                    onTabChange={setActiveInputTab}
                />

                <div className="mt-4">
                    {activeInputTab === 'planets' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {planets.map(planet => (
                                <PlanetInput
                                    key={planet.id}
                                    planet={planet}
                                    onChange={handlePlanetPositionChange}
                                />
                            ))}
                        </div>
                    )}

                    {activeInputTab === 'houses' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {houses.map(house => (
                                <HouseInput
                                    key={house.number}
                                    house={house}
                                    onChange={handleHousePositionChange}
                                />
                            ))}
                        </div>
                    )}

                    {activeInputTab === 'adjust' && (
                        <PlanetAdjuster
                            planets={planets}
                            houses={houses}
                            onPlanetAdjusted={handlePlanetAdjustment}
                        />
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={handleCalculate}
                    >
                        {isCalculated ? 'Update Results' : 'Calculate Hits'}
                    </button>
                </div>
            </div>

            {/* Section 2: Results (Always Visible) */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Results</h2>

                <TabSelector
                    tabs={resultTabs}
                    activeTab={activeResultTab}
                    onTabChange={setActiveResultTab}
                />

                <div className="mt-4">
                    {activeResultTab === 'original' && (
                        <ResultsTable
                            planets={originalPlanets.length > 0 ? originalPlanets : planets}
                            houses={houses}
                            mode="original"
                        />
                    )}

                    {activeResultTab === 'corrected' && (
                        <ResultsTable
                            planets={planets}
                            houses={houses}
                            mode="corrected"
                        />
                    )}

                    {activeResultTab === 'comparison' && (
                        <div>
                            <div className="mb-4 flex space-x-4">
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-green-300 mr-2"></div>
                                    <span>Improved (Negative → Positive)</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-red-300 mr-2"></div>
                                    <span>Worsened (Positive → Negative)</span>
                                </div>
                            </div>
                            <ResultsTable
                                planets={planets}
                                houses={houses}
                                mode="comparison"
                                originalPlanets={originalPlanets}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VastuCalculator;