// src/pages/horoscope/KP.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TabSelector from '../../components/common/TabSelector';

const KPHoroscope = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('kpChart');

    // Define tabs for different KP chart views
    const tabs = [
        { id: 'kpChart', label: t('KP Chart') },
        { id: 'starLords', label: t('Star Lords') },
        { id: 'transitKP', label: t('Transit') }
    ];

    // Mock data for KP planets with additional KP-specific fields
    const planets = [
        {
            id: 'sun',
            name: t('planets.sun'),
            degrees: '057-08',
            house: 1,
            sign: t('signs.aries'),
            nakshatra: 'Bharani',
            subLord: 'Venus',
            starLord: 'Venus'
        },
        {
            id: 'moon',
            name: t('planets.moon'),
            degrees: '070-40',
            house: 4,
            sign: t('signs.cancer'),
            nakshatra: 'Pushya',
            subLord: 'Saturn',
            starLord: 'Saturn'
        },
        {
            id: 'mars',
            name: t('planets.mars'),
            degrees: '054-49',
            house: 3,
            sign: t('signs.gemini'),
            nakshatra: 'Ardra',
            subLord: 'Mercury',
            starLord: 'Rahu'
        },
        {
            id: 'mercury',
            name: t('planets.mercury'),
            degrees: '033-49',
            house: 2,
            sign: t('signs.taurus'),
            nakshatra: 'Krittika',
            subLord: 'Sun',
            starLord: 'Sun'
        },
        {
            id: 'jupiter',
            name: t('planets.jupiter'),
            degrees: '220-39',
            house: 7,
            sign: t('signs.libra'),
            nakshatra: 'Vishakha',
            subLord: 'Jupiter',
            starLord: 'Jupiter'
        },
        {
            id: 'venus',
            name: t('planets.venus'),
            degrees: '102-25',
            house: 5,
            sign: t('signs.leo'),
            nakshatra: 'Uttara Phalguni',
            subLord: 'Venus',
            starLord: 'Sun'
        },
        {
            id: 'saturn',
            name: t('planets.saturn'),
            degrees: '184-30',
            house: 10,
            sign: t('signs.capricorn'),
            nakshatra: 'Sravana',
            subLord: 'Moon',
            starLord: 'Moon'
        },
        {
            id: 'rahu',
            name: t('planets.rahu'),
            degrees: '061-44',
            house: 12,
            sign: t('signs.pisces'),
            nakshatra: 'Uttara Bhadrapada',
            subLord: 'Saturn',
            starLord: 'Saturn'
        },
        {
            id: 'ketu',
            name: t('planets.ketu'),
            degrees: '241-44',
            house: 6,
            sign: t('signs.virgo'),
            nakshatra: 'Uttara Phalguni',
            subLord: 'Venus',
            starLord: 'Sun'
        }
    ];

    // House cusps for KP system
    const houses = [
        { number: 1, position: '115-51', sign: t('signs.cancer'), starLord: 'Saturn', subLord: 'Mercury' },
        { number: 2, position: '140-53', sign: t('signs.leo'), starLord: 'Sun', subLord: 'Venus' },
        { number: 3, position: '169-57', sign: t('signs.virgo'), starLord: 'Mercury', subLord: 'Jupiter' },
        { number: 4, position: '202-19', sign: t('signs.libra'), starLord: 'Venus', subLord: 'Saturn' },
        { number: 5, position: '235-18', sign: t('signs.scorpio'), starLord: 'Mars', subLord: 'Mars' },
        { number: 6, position: '266-40', sign: t('signs.sagittarius'), starLord: 'Jupiter', subLord: 'Rahu' },
        { number: 7, position: '295-51', sign: t('signs.capricorn'), starLord: 'Saturn', subLord: 'Saturn' },
        { number: 8, position: '320-53', sign: t('signs.aquarius'), starLord: 'Saturn', subLord: 'Jupiter' },
        { number: 9, position: '349-57', sign: t('signs.pisces'), starLord: 'Jupiter', subLord: 'Mercury' },
        { number: 10, position: '022-19', sign: t('signs.aries'), starLord: 'Mars', subLord: 'Venus' },
        { number: 11, position: '055-18', sign: t('signs.taurus'), starLord: 'Venus', subLord: 'Saturn' },
        { number: 12, position: '086-40', sign: t('signs.gemini'), starLord: 'Mercury', subLord: 'Mercury' }
    ];

    // Render different content based on active tab
    const renderTabContent = () => {
        switch (activeTab) {
            case 'kpChart':
                return (
                    <div>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">{t('Planet Positions')}</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {t('Planet')}
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {t('Degrees')}
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {t('House')}
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {t('Sign')}
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {t('Nakshatra')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {planets.map(planet => (
                                            <tr key={planet.id}>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">{planet.name}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">{planet.degrees}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">{planet.house}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">{planet.sign}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">{planet.nakshatra}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );

            case 'starLords':
                return (
                    <div>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">{t('Star Lords and Sub Lords')}</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {t('Planet')}
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {t('Star Lord')}
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {t('Sub Lord')}
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {t('Signification')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {planets.map(planet => (
                                            <tr key={planet.id}>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">{planet.name}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">{planet.starLord}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">{planet.subLord}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                    {planet.starLord === planet.subLord ? 'Strong' : 'Normal'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-2">{t('House Cusps')}</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {t('House')}
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {t('Position')}
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {t('Sign')}
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {t('Star Lord')}
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {t('Sub Lord')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {houses.map(house => (
                                            <tr key={house.number}>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">{house.number}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">{house.position}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">{house.sign}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">{house.starLord}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">{house.subLord}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );

            case 'transitKP':
                return (
                    <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                        <p className="font-medium">{t('Coming Soon')}</p>
                        <p className="mt-2">{t('Transit KP chart analysis will be available in a future update.')}</p>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">{t('KP Horoscope')}</h1>

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

                {/* Tab selector for different KP chart views */}
                <div className="mb-6">
                    <TabSelector
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </div>

                {/* Render content based on active tab */}
                {renderTabContent()}
            </div>
        </div>
    );
};

export default KPHoroscope;