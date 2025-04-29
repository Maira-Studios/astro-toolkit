import React from 'react';
import { useTranslation } from 'react-i18next';
import { useChartContext } from '../../context/ChartContext.jsx';
import VedicChartPanel from '../../components/layout/VedicChartPanel.jsx';
import PlaceholderComponent from '../../components/common/PlaceholderComponent.jsx';
import ChartSwitcher from '../../components/common/ChartSwitcher';

const ParashariTables = ({ openChartSidebar }) => {

    const { t } = useTranslation();
    const { currentChart } = useChartContext();

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow">
            <ChartSwitcher openChartSidebar={openChartSidebar} />
            {currentChart.vedic ? (
                <VedicChartPanel vedicChart={currentChart.vedic} />
            ) : (
                <div className="text-center text-gray-500">
                    <PlaceholderComponent
                        title={t('No Vedic Data')}
                        message={t('Generate or load a chart to view Parashari tables')}
                    />
                </div>
            )}
        </div>
    );
};

export default ParashariTables;