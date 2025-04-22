// src/pages/VastuCalculator.js
import React, { useState, useEffect } from 'react';

import ResultsTable from "../components/results/ResultsTable.jsx";
import TabSelector from '../components/common/TabSelector.jsx';
import PlanetInput from "../components/input/PlanetInput.jsx";
import HouseInput from "../components/input/HouseInput.jsx";
import PlanetAdjuster from "../components/input/PlanetAdjuster.jsx";
import PlanetRecommender from '../components/input/PlanetRecommender.jsx';

const VastuCalculator = ({ openSidebar }) => {
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

    // State for relationship type tabs in main view
    const [activeRelationshipTab, setActiveRelationshipTab] = useState('planet-house');
    const relationshipTabs = [
        { id: 'planet-house', label: 'Planet → House' },
        { id: 'planet-planet', label: 'Planet → Planet' }
    ];

    // State for results view mode
    const [resultViewMode, setResultViewMode] = useState('original');

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
        setPlanets(prev =>
            prev.map(planet =>
                planet.id === id ? { ...planet, position } : planet
            )
        );
    };


    // Handle calculation
    const handleCalculate = () => {
        if (!isCalculated) {
            // Store the original planets for comparison
            setOriginalPlanets(planets.map(planet => ({ ...planet, originalPosition: planet.position })));
            setIsCalculated(true);
        }
    };

    // Open planet input sidebar
    const openPlanetInputSidebar = () => {
        openSidebar({
            title: 'Planet Inputs',
            content: (
                <div className="grid grid-cols-1 gap-4">
                    {planets.map(planet => (
                        <PlanetInput
                            key={planet.id}
                            planet={planet}
                            onChange={handlePlanetPositionChange}
                        />
                    ))}
                </div>
            )
        });
    };

    // Open house input sidebar
    const openHouseInputSidebar = () => {
        openSidebar({
            title: 'House Inputs',
            content: (
                <div className="grid grid-cols-1 gap-4">
                    {houses.map(house => (
                        <HouseInput
                            key={house.number}
                            house={house}
                            onChange={handleHousePositionChange}
                        />
                    ))}
                </div>
            )
        });
    };

    // Open planet adjuster sidebar
    const openAdjusterSidebar = () => {
        openSidebar({
            title: 'Adjust Hits',
            content: (
                /*  <PlanetAdjuster
                     planets={planets}
                     houses={houses}
                     onPlanetAdjusted={handlePlanetAdjustment}
                 /> */
                <PlanetRecommender
                    planets={planets}
                    houses={houses}
                    onRecommendationApplied={handlePlanetAdjustment}
                />

            )
        });
    };

    // Effect to update original planets when isCalculated changes
    useEffect(() => {
        if (isCalculated && originalPlanets.length === 0) {
            setOriginalPlanets(planets.map(planet => ({ ...planet, originalPosition: planet.position })));
        }
    }, [isCalculated, planets, originalPlanets.length]);

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header area with title and action buttons */}
            <header className="bg-white border-b p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Astro Vastu Hit Table</h1>

                    <div className="flex space-x-2">
                        <button
                            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={openPlanetInputSidebar}
                        >
                            Edit Planets
                        </button>
                        <button
                            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={openHouseInputSidebar}
                        >
                            Edit Houses
                        </button>
                        <button
                            className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            onClick={openAdjusterSidebar}
                        >
                            Adjust Hits
                        </button>
                        <button
                            className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                            onClick={handleCalculate}
                        >
                            {isCalculated ? 'Update Results' : 'Calculate Hits'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main content area with results */}
            <div className="flex-1 overflow-auto p-4 bg-gray-50">
                <div className="bg-white rounded-lg shadow p-6 h-full">

                    {/* Relationship type tabs */}
                    <div className="flex flex-col h-full">
                        <div className="mb-4">
                            <TabSelector
                                tabs={relationshipTabs}
                                activeTab={activeRelationshipTab}
                                onTabChange={setActiveRelationshipTab}
                            />

                            {/* View mode toggle buttons */}
                            <div className="flex space-x-2 mt-4">
                                <button
                                    className={`px-3 py-1 rounded ${resultViewMode === 'original' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    onClick={() => setResultViewMode('original')}
                                >
                                    Original
                                </button>
                                <button
                                    className={`px-3 py-1 rounded ${resultViewMode === 'corrected' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    onClick={() => setResultViewMode('corrected')}
                                    disabled={!isCalculated}
                                >
                                    Corrected
                                </button>
                                <button
                                    className={`px-3 py-1 rounded ${resultViewMode === 'comparison' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    onClick={() => setResultViewMode('comparison')}
                                    disabled={!isCalculated}
                                >
                                    Comparison
                                </button>
                            </div>
                        </div>

                        {/* Comparison Legend (only shown for comparison view) */}
                        {resultViewMode === 'comparison' && (
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
                        )}

                        {/* Results tables - fills remaining height */}
                        <div className="flex-1 overflow-auto">
                            {activeRelationshipTab === 'planet-house' && (
                                <ResultsTable
                                    planets={resultViewMode === 'original' ? (originalPlanets.length > 0 ? originalPlanets : planets) : planets}
                                    houses={houses}
                                    mode={resultViewMode}
                                    originalPlanets={originalPlanets}
                                    relationshipType="planet-house"
                                />
                            )}

                            {activeRelationshipTab === 'planet-planet' && (
                                <ResultsTable
                                    planets={resultViewMode === 'original' ? (originalPlanets.length > 0 ? originalPlanets : planets) : planets}
                                    houses={houses}
                                    mode={resultViewMode}
                                    originalPlanets={originalPlanets}
                                    relationshipType="planet-planet"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VastuCalculator;