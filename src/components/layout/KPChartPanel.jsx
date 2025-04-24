import React from 'react';
import { useTranslation } from 'react-i18next';
import PlaceholderComponent from '../common/PlaceholderComponent.jsx';

const KPChartPanel = ({ kpData }) => {
    const { t } = useTranslation();

    // Helper function to format degrees to two decimal places
    const formatDegree = (deg) => {
        return Number(deg).toFixed(2);
    };

    if (!kpData) {
        return (
            <PlaceholderComponent
                title={t('No data')}
                message={t('Generate a chart to view KP calculations')}
            />
        );
    }

    return (
        <div>
            <h3 className="font-medium mb-2">{t('KP Positions')}</h3>
            <table className="w-full text-sm border">
                <thead>
                    <tr>
                        <th className="border px-2">{t('Planet')}</th>
                        <th className="border px-2">{t('Degrees')}</th>
                        <th className="border px-2">{t('Rasi Lord')}</th>
                        <th className="border px-2">{t('Star Lord')}</th>
                        <th className="border px-2">{t('Sub Lord')}</th>
                    </tr>
                </thead>
                <tbody>
                    {kpData.kpPositions.map(kp => (
                        <tr key={kp.planet}>
                            <td className="border px-2">{kp.planet}</td>
                            <td className="border px-2">{formatDegree(kp.compoundDegree)}</td>
                            <td className="border px-2">{kp.rasiLord}</td>
                            <td className="border px-2">{kp.starLord}</td>
                            <td className="border px-2">{kp.subLord}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-6">
                <h3 className="font-medium mb-2">{t('House Cusps')}</h3>
                <table className="w-full text-sm border">
                    <thead>
                        <tr>
                            <th className="border px-2">{t('Cusp')}</th>
                            <th className="border px-2">{t('Degree')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {kpData.houseCusps.map(c => (
                            <tr key={c.cusp}>
                                <td className="border px-2">{c.cusp}</td>
                                <td className="border px-2">{formatDegree(c.degree)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default KPChartPanel;