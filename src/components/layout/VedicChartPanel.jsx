// src/components/layout/VedicChartPanel.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import PlaceholderComponent from '../common/PlaceholderComponent.jsx';

// Zodiac sign names for sidereal chart
const SIGN_NAMES = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const VedicChartPanel = ({ vedicChart }) => {
    const { t } = useTranslation();

    if (!vedicChart) {
        return (
            <PlaceholderComponent
                title={t('No data')}
                message={t('Generate a chart to view Vedic positions')}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-medium mb-2">{t('Planetary Positions')}</h3>
                <table className="w-full text-sm border">
                    <thead>
                        <tr>
                            <th className="border px-2">{t('Planet')}</th>
                            <th className="border px-2">{t('Degree')}</th>
                            <th className="border px-2">{t('Sign')}</th>
                            <th className="border px-2">{t('House')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vedicChart.planetaryPositions.map(p => {
                            const deg = Number(p.degree);
                            const signIndex = Math.floor(deg / 30) % 12;
                            const signDegree = (deg % 30).toFixed(2);
                            const signName = SIGN_NAMES[signIndex];
                            return (
                                <tr key={p.planet}>
                                    <td className="border px-2">{p.planet}</td>
                                    <td className="border px-2">{signDegree}°</td>
                                    <td className="border px-2">{signIndex + 1} - {t(signName)}</td>
                                    <td className="border px-2">{p.house ?? '-'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VedicChartPanel;
