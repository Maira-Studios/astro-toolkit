import React from 'react';
import { useTranslation } from 'react-i18next';
import PlaceholderComponent from '../common/PlaceholderComponent.jsx';

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
                            <th className="border px-2">{t('House')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vedicChart.planetaryPositions.map(p => (
                            <tr key={p.planet}>
                                <td className="border px-2">{p.planet}</td>
                                <td className="border px-2">{p.degree.toFixed(2)}</td>
                                <td className="border px-2">{p.house ?? '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div>
                <h3 className="font-medium mb-2">{t('House Cusps')}</h3>
                <table className="w-full text-sm border">
                    <thead>
                        <tr>
                            <th className="border px-2">{t('Cusp')}</th>
                            <th className="border px-2">{t('Degree')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vedicChart.houseCusps.map(c => (
                            <tr key={c.cusp}>
                                <td className="border px-2">{c.cusp}</td>
                                <td className="border px-2">{c.degree.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VedicChartPanel;
