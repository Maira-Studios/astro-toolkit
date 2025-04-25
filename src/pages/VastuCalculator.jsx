// src/pages/VastuCalculator.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useChartContext } from '../context/ChartContext.jsx';
import ResultsTable from "../components/results/ResultsTable.jsx";
import TabSelector from '../components/common/TabSelector.jsx';
import PlanetInput from "../components/input/PlanetInput.jsx";
import HouseInput from "../components/input/HouseInput.jsx";
import PlanetRecommender from '../components/input/PlanetRecommender.jsx';
import LanguageSelector from '../components/common/LanguageSelector.jsx';

const VastuCalculator = ({ openSidebar, hideButtons = false, navigateToNewChart = null }) => {
    const { t, i18n } = useTranslation();
    const { currentChart } = useChartContext();

    // State for planets and houses - initialize with empty arrays
    const [planets, setPlanets] = useState([]);
    const [houses, setHouses] = useState([]);

    // Keep a reference to the current sidebar content to update it
    const [currentSidebarContent, setCurrentSidebarContent] = useState(null);

    // State for relationship type tabs in main view
    const [activeRelationshipTab, setActiveRelationshipTab] = useState('planet-house');

    const relationshipTabs = [
        { id: 'planet-house', label: t('tabs.planetToHouse') },
        { id: 'planet-planet', label: t('tabs.planetToPlanet') }
    ];

    // State for calculation status
    const [isCalculated, setIsCalculated] = useState(true);

    // Update planet names and positions when language changes or current chart changes
    useEffect(() => {
        if (currentChart) {
            // Extract planet and house data from the chart
            if (currentChart.vedicData?.planets) {
                // Apply translation to planet names
                const translatedPlanets = currentChart.vedicData.planets.map(planet => ({
                    ...planet,
                    name: t(`planets.${planet.id}`)
                }));
                setPlanets(translatedPlanets);
            }

            if (currentChart.vedicData?.houses) {
                setHouses(currentChart.vedicData.houses);
            }
        }
    }, [currentChart, i18n.language, t]);

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

    // Open sidebar with planet input form
    const openPlanetInputSidebar = () => {
        const content = (
            <div className="space-y-4">
                {planets.map(planet => (
                    <PlanetInput
                        key={planet.id}
                        planet={planet}
                        onChange={handlePlanetPositionChange}
                    />
                ))}
            </div>
        );

        setCurrentSidebarContent({
            title: t('actions.editPlanets'),
            content
        });

        openSidebar({
            title: t('actions.editPlanets'),
            content
        });
    };

    // Update planet input sidebar content
    const updatePlanetInputSidebar = () => {
        const content = (
            <div className="space-y-4">
                {planets.map(planet => (
                    <PlanetInput
                        key={planet.id}
                        planet={planet}
                        onChange={handlePlanetPositionChange}
                    />
                ))}
            </div>
        );

        setCurrentSidebarContent({
            title: t('actions.editPlanets'),
            content
        });

        openSidebar({
            title: t('actions.editPlanets'),
            content
        });
    };

    // Open sidebar with house input form
    const openHouseInputSidebar = () => {
        const content = (
            <div className="space-y-4">
                {houses.map(house => (
                    <HouseInput
                        key={house.number}
                        house={house}
                        onChange={handleHousePositionChange}
                    />
                ))}
            </div>
        );

        setCurrentSidebarContent({
            title: t('actions.editHouses'),
            content
        });

        openSidebar({
            title: t('actions.editHouses'),
            content
        });
    };

    // Update house input sidebar content
    const updateHouseInputSidebar = () => {
        const content = (
            <div className="space-y-4">
                {houses.map(house => (
                    <HouseInput
                        key={house.number}
                        house={house}
                        onChange={handleHousePositionChange}
                    />
                ))}
            </div>
        );

        setCurrentSidebarContent({
            title: t('actions.editHouses'),
            content
        });

        openSidebar({
            title: t('actions.editHouses'),
            content
        });
    };

    // Open sidebar with planet hit adjuster
    const openAdjusterSidebar = () => {
        const content = (
            <PlanetRecommender planets={planets} houses={houses} />
        );

        setCurrentSidebarContent({
            title: t('actions.adjustHits'),
            content
        });

        openSidebar({
            title: t('actions.adjustHits'),
            content
        });
    };

    // Handle calculate/recalculate button click
    const handleCalculate = () => {
        // For now, just toggle the calculation state
        // In a real app, you would perform the calculation here
        setIsCalculated(true);
    };

    // If no current chart exists, render an empty state with prompt to create one
    if (!currentChart) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center p-6 max-w-md">
                    <div className="text-amber-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">{t('No Active Chart')}</h2>
                    <p className="text-gray-600 mb-6">
                        {t('You need to create or select a chart before using the Hit Calculator.')}
                    </p>
                    <button
                        onClick={() => navigateToNewChart ? navigateToNewChart() : null}
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 shadow-md"
                    >
                        {t('Create New Chart')}
                    </button>
                </div>
            </div>
        );
    }

    // If planets or houses are missing, show loading or error state
    if (planets.length === 0 || houses.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center p-6 max-w-md">
                    <div className="text-amber-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">{t('Loading Chart Data')}</h2>
                    <p className="text-gray-600">
                        {t('Please wait while we load the chart data.')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Top header with actions - hide if hideButtons is true */}
            {!hideButtons && (
                <header className="bg-white border-b">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-wrap gap-2 items-center">
                            <LanguageSelector />
                            <button
                                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={() => navigateToNewChart ? navigateToNewChart() : null}
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
            )}

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