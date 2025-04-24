// src/pages/VastuCalculator.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ResultsTable from "../components/results/ResultsTable.jsx";
import TabSelector from '../components/common/TabSelector.jsx';
import PlanetInput from "../components/input/PlanetInput.jsx";
import HouseInput from "../components/input/HouseInput.jsx";
import PlanetRecommender from '../components/input/PlanetRecommender.jsx';
import LanguageSelector from '../components/common/LanguageSelector.jsx';
import ChartSidebar from '../components/layout/ChartSidebar.jsx';

const VastuCalculator = ({ openSidebar, hideButtons = false }) => {
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