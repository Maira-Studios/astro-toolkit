
import React from 'react';
import { useTranslation } from 'react-i18next';
import PlaceholderComponent from '../common/PlaceholderComponent.jsx';

const KPChartPanel = ({ kpData }) => {
    const { t } = useTranslation();

    const kpNakshatraLords = [
        "Ke", "Ve", "Su", "Mo", "Ma", "Ra", "Ju", "Sa", "Me",
        "Ke", "Ve", "Su", "Mo", "Ma", "Ra", "Ju", "Sa", "Me",
        "Ke", "Ve", "Su", "Mo", "Ma", "Ra", "Ju", "Sa", "Me"
    ];

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
                        <th className="border px-2">{t('Compound °')}</th>
                        <th className="border px-2">{t('Star Lord')}</th>
                        <th className="border px-2">{t('Sub Lord')}</th>
                    </tr>
                </thead>
                <tbody>
                    {kpData.kpPositions.map(kp => (
                        <tr key={kp.planet}>
                            <td className="border px-2">{kp.planet}</td>
                            <td className="border px-2">{Number(kp.compoundDegree).toFixed(2)}</td>

                            <td className="border px-2">{kpNakshatraLords[kp.starLord] || kp.starLord}</td>
                            <td className="border px-2">{kpNakshatraLords[kp.subLord] || kp.subLord}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default KPChartPanel;
