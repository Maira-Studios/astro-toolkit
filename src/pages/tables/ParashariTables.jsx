// src/pages/ParashariTables.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useChartContext } from '../../context/ChartContext';
import ComingSoonPage from '../ComingSoonPage';

const ParashariTables = () => {
    const { t } = useTranslation();
    const { currentChart } = useChartContext();

    // If no chart is selected, show a message to create one
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
                        {t('You need to create or select a chart before viewing Parashari tables.')}
                    </p>
                    <button
                        onClick={() => window.location.hash = '#/new-chart'} // Simple navigation, replace with your routing method
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 shadow-md"
                    >
                        {t('Create New Chart')}
                    </button>
                </div>
            </div>
        );
    }

    // Check if we have the necessary data
    if (!currentChart.vedicData) {
        return <ComingSoonPage
            title={t('Data Not Available')}
            message={t('The Parashari table data is not available for this chart.')}
        />;
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('Planet')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('Sign')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('Degrees')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('House')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentChart.vedicData.planets?.map(planet => (
                            <tr key={planet.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {t(`planets.${planet.id}`)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {planet.sign || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {planet.position || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {planet.house || '-'}
                                </td>
                            </tr>
                        ))}
                        {!currentChart.vedicData.planets?.length && (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                    {t('No planetary data available')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ParashariTables;