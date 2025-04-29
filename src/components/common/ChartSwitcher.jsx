import React from 'react';
import { useTranslation } from 'react-i18next';
import { useChartContext } from '../../context/ChartContext.jsx';

const ChartSwitcher = ({ navigateToNewChart = null, openChartSidebar = null }) => {
    const { t } = useTranslation();
    const { charts, currentChart, loadChart } = useChartContext();

    const handleChange = (e) => {
        loadChart(e.target.value);
    };

    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
                <span className="font-medium text-lg">
                    {currentChart.name || t('Unnamed Chart')}
                </span>
                <select
                    value={currentChart.id || ''}
                    onChange={handleChange}
                    className="border border-gray-300 rounded px-2 py-1 focus:outline-none"
                >
                    {charts.map((chart) => (
                        <option key={chart.id} value={chart.id}>
                            {chart.name}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={() => {
                    if (openChartSidebar) {
                        openChartSidebar();
                    } else if (navigateToNewChart) {
                        navigateToNewChart();
                    }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
            >
                {t('Create New Chart')}
            </button>

        </div>
    );
};

export default ChartSwitcher;
