// src/pages/horoscope/Parashari.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TabSelector from '../../components/common/TabSelector';

const ParashariHoroscope = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('birthChart');

    // Define tabs for different chart views
    const tabs = [
        { id: 'birthChart', label: t('Birth Chart') },
        { id: 'navamsa', label: t('Navamsa') },
        { id: 'transitChart', label: t('Transit Chart') }
    ];

    // Mock data for planets in houses
    const planets = [
        { id: 'sun', name: t('planets.sun'), house: 1, degrees: '15°30\'', sign: t('signs.aries') },
        { id: 'moon', name: t('planets.moon'), house: 4, degrees: '23°45\'', sign: t('signs.cancer') },
        { id: 'mars', name: t('planets.mars'), house: 3, degrees: '8°20\'', sign: t('signs.gemini') },
        { id: 'mercury', name: t('planets.mercury'), house: 2, degrees: '12°15\'', sign: t('signs.taurus') },
        { id: 'jupiter', name: t('planets.jupiter'), house: 7, degrees: '28°10\'', sign: t('signs.libra') },
        { id: 'venus', name: t('planets.venus'), house: 5, degrees: '17°42\'', sign: t('signs.leo') },
        { id: 'saturn', name: t('planets.saturn'), house: 10, degrees: '9°15\'', sign: t('signs.capricorn') },
        { id: 'rahu', name: t('planets.rahu'), house: 12, degrees: '3°22\'', sign: t('signs.pisces') },
        { id: 'ketu', name: t('planets.ketu'), house: 6, degrees: '3°22\'', sign: t('signs.virgo') },
    ];

    // Simple chart grid representation (4x3 grid for 12 houses)
    const renderChartGrid = () => {
        // Layout of houses in North Indian chart style
        const housePositions = [
            [12, 1, 2],
            [11, '', 3],
            [10, 9, 4],
            ['', 8, 7, 6, 5]
        ];

        return (
            <div className="grid grid-cols-3 gap-1 w-80 h-80 mx-auto border-2 border-gray-400">
                {housePositions.map((row, rowIndex) => (
                    <React.Fragment key={`row-${rowIndex}`}>
                        {row.map((house, colIndex) => (
                            <div
                                key={`house-${rowIndex}-${colIndex}`}
                                className={`border border-gray-400 p-2 flex flex-col ${rowIndex === 1 && colIndex === 1 ? 'col-span-1 row-span-1 items-center justify-center' : ''}`}
                            >
                                {house !== '' ? (
                                    <>
                                        <div className="text-xs text-gray-500">House {house}</div>
                                        <div className="text-sm font-bold">
                                            {/* Display planets in this house */}
                                            {planets.filter(p => p.house === house).map(planet => (
                                                <div key={planet.id} className="whitespace-nowrap">{planet.name}</div>
                                            ))}
                                        </div>
                                    </>
                                ) : rowIndex === 1 && colIndex === 1 ? (
                                    <div className="text-center">Birth Chart</div>
                                ) : null}
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">{t('Parashari Horoscope')}</h1>

            <div className="bg-white rounded-lg shadow p-6">
                {/* Chart data display */}
                <div className="mb-6">
                    <div className="text-lg font-semibold mb-2">{t('Current Chart')}: John Doe</div>
                    <div className="text-sm text-gray-600 mb-1">
                        {t('Date')}: April 15, 2025 | {t('Time')}: 14:30
                    </div>
                    <div className="text-sm text-gray-600">
                        {t('Location')}: New York, USA | {t('Coordinates')}: 40.7128° N, 74.0060° W
                    </div>
                </div>

                {/* Tab selector for different chart views */}
                <div className="mb-6">
                    <TabSelector
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </div>

                <div className="flex flex-wrap">
                    {/* Chart visualization */}
                    <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
                        {renderChartGrid()}
                    </div>

                    {/* Planet positions table */}
                    <div className="w-full lg:w-1/2">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {t('Planet')}
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {t('Sign')}
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {t('Degrees')}
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {t('House')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {planets.map(planet => (
                                        <tr key={planet.id}>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm">{planet.name}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm">{planet.sign}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm">{planet.degrees}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm">{planet.house}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParashariHoroscope;