// src/pages/astro-vastu/HitCalculator.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ResultsTable from '../../components/results/ResultsTable';
import { useChartContext } from '../../context/ChartContext';
import TabSelector from '../../components/common/TabSelector';

const HitCalculator = ({ navigateToNewChart = null }) => {
    const { t } = useTranslation();
    const { currentChart } = useChartContext();
    const [relationshipType, setRelationshipType] = useState('planet-house');

    // Log current chart data to debug
    useEffect(() => {
        if (currentChart && currentChart.kp) {
            console.log("Current Chart:", currentChart);
        }
    }, [currentChart]);

    // Define relationship tabs
    const relationshipTabs = [
        { id: 'planet-house', label: t('Planet → House') },
        { id: 'planet-planet', label: t('Planet → Planet') }
    ];

    // If no chart is selected
    if (!currentChart || !currentChart.id) {
        return (
            <div className="text-center p-8">
                <h2 className="text-xl font-bold text-gray-700 mb-4">
                    {t('No Chart Selected')}
                </h2>
                <p className="text-gray-600 mb-6">
                    {t('Please select or create a chart to view hit results.')}
                </p>
                <button
                    onClick={() => navigateToNewChart && navigateToNewChart()}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {t('Create New Chart')}
                </button>
            </div>
        );
    }

    // If chart data is loading or missing
    if (!currentChart.kp || !currentChart.kp.kpPositions || !currentChart.kp.houseCusps ||
        currentChart.kp.kpPositions.length === 0 || currentChart.kp.houseCusps.length === 0) {
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

    // Apply translation to planet names
    const planets = currentChart.kp.kpPositions.map(planet => ({
        ...planet,
        name: t(`${planet.planet}`),
        canHit: true // Enable all planets for hitting by default
    }));

    const houses = currentChart.kp.houseCusps;

    return (
        <div className="flex flex-col h-full">
            {/* Header with chart info and controls */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">
                        {t('Analyzing')}: {currentChart.name || t('Unnamed Chart')}
                    </h2>

                    <div className="flex space-x-4">
                        {/* Tab selector for relationship type */}
                        <TabSelector
                            tabs={relationshipTabs}
                            activeTab={relationshipType}
                            onTabChange={setRelationshipType}
                        />
                    </div>
                </div>
            </div>

            {/* Results Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden flex-1">
                <ResultsTable
                    planets={planets}
                    houses={houses}
                    mode="current"
                    relationshipType={relationshipType}
                />
            </div>
        </div>
    );
};

export default HitCalculator;