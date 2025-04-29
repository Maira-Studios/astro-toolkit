// src/pages/astro-vastu/HitCalculator.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResultsTable from '../../components/results/ResultsTable';
import { useChartContext } from '../../context/ChartContext';

const HitCalculator = ({ navigateToNewChart = null }) => {
    const { t } = useTranslation();
    const { currentChart } = useChartContext();

    const [relationshipType, setRelationshipType] = useState('planet-house');

    // Debug current chart
    console.log("HitCalculator - Current Chart:", currentChart);

    // Handle relationship type change
    const handleRelationshipTypeChange = (e) => {
        setRelationshipType(e.target.value);
    };

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

    // If KP data is missing
    if (!currentChart.kp) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center p-6 max-w-md">
                    <div className="text-amber-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">{t('Missing Chart Data')}</h2>
                    <p className="text-gray-600">
                        {t('This chart does not contain KP data required for hit calculation.')}
                    </p>
                </div>
            </div>
        );
    }

    // Debug KP data structure
    console.log("KP Data:", currentChart.kp);

    // Format position to ensure it's in the correct format (e.g., "057-08")
    const formatPosition = (position) => {
        // If the position is already in the right format, return it
        if (typeof position === 'string' && /^\d{3}-\d{2}$/.test(position)) {
            return position;
        }

        // If it's a number, convert to the right format
        if (typeof position === 'number') {
            const degrees = Math.floor(position);
            const minutes = Math.floor((position - degrees) * 60);
            return `${degrees.toString().padStart(3, '0')}-${minutes.toString().padStart(2, '0')}`;
        }

        // If we can't format it, return a default value
        console.warn("Invalid position format:", position);
        return "000-00";
    };

    // Extract and format planets data
    const planets = Array.isArray(currentChart.kp.kpPositions)
        ? currentChart.kp.kpPositions.map(planet => {
            // Handle both id and planet properties
            const planetId = planet.id || planet.planet;
            // Format planet name for display
            const planetName = t(`${planetId}`);
            // Ensure position is in the right format
            const formattedPosition = formatPosition(planet.compoundDegree);

            return {
                id: planetId,
                planet: planetId, // Ensure planet property exists
                name: planetName,
                position: formattedPosition,
                // canHit is now handled in ResultsTable
            };
        })
        : [];

    console.log("Formatted Planets:", planets);

    // Extract and format houses data
    const houses = Array.isArray(currentChart.kp.houseCusps)
        ? currentChart.kp.houseCusps.map(cusp => ({
            // Handle both number and house properties
            number: cusp.cusp,
            // Ensure position is in the right format
            position: cusp.degree
        }))
        : [];

    console.log("Formatted Houses:", houses);

    // Check if we have valid data
    if (planets.length === 0 || houses.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center p-6 max-w-md">
                    <div className="text-amber-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">{t('Incomplete Chart Data')}</h2>
                    <p className="text-gray-600">
                        {t('The chart data is incomplete. Make sure it includes KP positions and house cusps.')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">
                        {t('Analyzing')}: {currentChart.name || t('Unnamed Chart')}
                    </h2>

                    <div className="flex space-x-4">
                        <select
                            value={relationshipType}
                            onChange={handleRelationshipTypeChange}
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="planet-house">{t('Planet → House')}</option>
                            <option value="planet-planet">{t('Planet → Planet')}</option>
                        </select>
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