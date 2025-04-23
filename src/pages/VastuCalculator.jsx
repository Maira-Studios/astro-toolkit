// src/pages/VastuCalculator.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import ResultsTable from "../components/results/ResultsTable.jsx";
import TabSelector from '../components/common/TabSelector.jsx';
import PlanetInput from "../components/input/PlanetInput.jsx";
import HouseInput from "../components/input/HouseInput.jsx";
import PlanetRecommender from '../components/input/PlanetRecommender.jsx';
import LanguageSelector from '../components/common/LanguageSelector.jsx';
import ChartSidebar from '../components/layout/ChartSidebar.jsx';


const VastuCalculator = ({ openSidebar }) => {
    const { t, i18n } = useTranslation();

    // State for planets and houses
    const [planets, setPlanets] = useState([
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

    // Keep a reference to the current sidebar content to update it
    const [currentSidebarContent, setCurrentSidebarContent] = useState(null);

    // Update planet names when language changes
    useEffect(() => {
        setPlanets(prev => prev.map(planet => ({
            ...planet,
            name: t(`planets.${planet.id}`)
        })));
    }, [i18n.language, t]);

    // State for relationship type tabs in main view
    const [activeRelationshipTab, setActiveRelationshipTab] = useState('planet-house');
    const relationshipTabs = [
        { id: 'planet-house', label: t('tabs.planetToHouse') },
        { id: 'planet-planet', label: t('tabs.planetToPlanet') }
    ];

    // State for calculation status
    const [isCalculated, setIsCalculated] = useState(true); // Default to true to show results immediately

    // Handle planet position change
    const handlePlanetPositionChange = (id, position) => {
        // Validate position format
        if (position && !/^\d{3}-\d{2}$/.test(position)) {
            return; // Don't update if format is invalid
        }

        // Update planets state
        setPlanets(prev => prev.map(planet =>
            planet.id === id ? { ...planet, position } : planet
        ));

        // Update the current sidebar content if it's the planet input sidebar
        if (currentSidebarContent && currentSidebarContent.title === t('actions.editPlanets')) {
            updatePlanetInputSidebar();
        }
    };

    // Handle house position change
    const handleHousePositionChange = (number, position) => {
        // Validate position format
        if (position && !/^\d{3}-\d{2}$/.test(position)) {
            return; // Don't update if format is invalid
        }

        // Update houses state
        setHouses(prev => prev.map(house =>
            house.number === number ? { ...house, position } : house
        ));

        // Update the current sidebar content if it's the house input sidebar
        if (currentSidebarContent && currentSidebarContent.title === t('actions.editHouses')) {
            updateHouseInputSidebar();
        }
    };

    // Handle planet adjustment
    const handlePlanetAdjustment = (id, position) => {
        // Update planets state
        setPlanets(prev =>
            prev.map(planet =>
                planet.id === id ? { ...planet, position } : planet
            )
        );
    };

    // Handle calculation
    const handleCalculate = () => {
        setIsCalculated(true);
    };

    // Function to create and update the planet input sidebar
    const updatePlanetInputSidebar = () => {
        const content = {
            title: t('actions.editPlanets'),
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
        };

        setCurrentSidebarContent(content);
        return content;
    };

    // Function to create and update the house input sidebar
    const updateHouseInputSidebar = () => {
        const content = {
            title: t('actions.editHouses'),
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
        };

        setCurrentSidebarContent(content);
        return content;
    };

    // Open planet input sidebar
    const openPlanetInputSidebar = () => {
        const content = updatePlanetInputSidebar();
        openSidebar(content);
    };

    // Open house input sidebar
    const openHouseInputSidebar = () => {
        const content = updateHouseInputSidebar();
        openSidebar(content);
    };

    // Open planet adjuster sidebar
    const openAdjusterSidebar = () => {
        const content = {
            title: t('actions.adjustHits'),
            content: (
                <PlanetRecommender
                    planets={planets}
                    houses={houses}
                    onRecommendationApplied={handlePlanetAdjustment}
                />
            )
        };

        setCurrentSidebarContent(content);
        openSidebar(content);
    };


    const updateChartSidebar = () => {
        return {
            title: 'Birth Charta Data',
            content: <ChartSidebar onClose={() => openSidebar(null)} />
        };
    };

    const openChartSidebar = () => {
        const panel = updateChartSidebar();
        setCurrentSidebarContent(panel);
        openSidebar(panel);
    };


    return (
        <div className="w-full h-full flex flex-col">
            {/* Header area with title and action buttons */}
            <header className="bg-white border-b p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold">{t('appTitle')}</h1>
                        <LanguageSelector />
                    </div>

                    <div className="flex space-x-2">
                        <button
                            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={openChartSidebar}
                        >
                            {t('New Chart')}
                        </button>
                        <button
                            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={openPlanetInputSidebar}
                        >
                            {t('actions.editPlanets')}
                        </button>
                        <button
                            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={openHouseInputSidebar}
                        >
                            {t('actions.editHouses')}
                        </button>
                        <button
                            className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            onClick={openAdjusterSidebar}
                        >
                            {t('actions.adjustHits')}
                        </button>
                        <button
                            className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                            onClick={handleCalculate}
                        >
                            {isCalculated ? t('actions.updateResults') : t('actions.calculateHits')}
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
                        </div>

                        {/* Results tables - fills remaining height */}
                        <div className="flex-1 overflow-auto">
                            {isCalculated && (
                                <>
                                    {activeRelationshipTab === 'planet-house' && (
                                        <ResultsTable
                                            planets={planets}
                                            houses={houses}
                                            relationshipType="planet-house"
                                        />
                                    )}

                                    {activeRelationshipTab === 'planet-planet' && (
                                        <ResultsTable
                                            planets={planets}
                                            houses={houses}
                                            relationshipType="planet-planet"
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VastuCalculator;