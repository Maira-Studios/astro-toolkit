// src/pages/tables/KPTables.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import TabSelector from '../../components/common/TabSelector';

const KPTables = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = React.useState('kpPlanetTable');

    // Define tabs for different table types
    const tabs = [
        { id: 'kpPlanetTable', label: t('Planet Degrees') },
        { id: 'kpHouseTable', label: t('House Cusps') }
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">{t('KP Tables')}</h1>

            <div className="bg-white rounded-lg shadow p-6">
                {/* Chart data display */}
                <div className="mb-6">
                    <div className="text-lg font-semibold mb-2">{t('Current Chart')}: John Doe</div>
                    <div className="text-sm text-gray-600 mb-1">
                        {t('Date')}: April 15, 2025 | {t('Time')}: 14:30
                    </div>
                    <div className="text-sm text-gray-600">
                        {t('Location')}: New York, USA
                    </div>
                </div>

                {/* Tab selector for different tables */}
                <div className="mb-6">
                    <TabSelector
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </div>

                {/* KP Planet Table */}
                {activeTab === 'kpPlanetTable' && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Planet')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Degrees')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Rasi')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Star Lord')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Sub Lord')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Sub-Sub Lord')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {/* This will be populated from your server data */}
                                {/* No mock data here - your existing calculations will provide this */}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* KP House Table */}
                {activeTab === 'kpHouseTable' && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Cusp')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Degree')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Rasi')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Star Lord')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Sub Lord')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {/* This will be populated from your server data */}
                                {/* No mock data here - your existing calculations will provide this */}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KPTables;