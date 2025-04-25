// src/pages/tables/KpTables.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useChartContext } from '../../context/ChartContext.jsx';
import KPChartPanel from '../../components/layout/KPChartPanel.jsx';
import PlaceholderComponent from '../../components/common/PlaceholderComponent.jsx';

const KpTables = () => {
    const { t } = useTranslation();
    const { currentChart } = useChartContext();

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow">
            {currentChart.kp ? (
                <KPChartPanel kpData={currentChart.kp} />
            ) : (
                <div className="text-center text-gray-500">
                    <PlaceholderComponent
                        title={t('No KP Data')}
                        message={t('Generate or load a chart to view KP tables')}
                    />
                </div>
            )}
        </div>
    );
};

export default KpTables;