import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TabSelector from '../common/TabSelector.jsx';
import VedicChartPanel from './VedicChartPanel.jsx';
import KPChartPanel from './KPChartPanel.jsx';
import { getVedicChart, getKPCalculations } from '../../utils/AstroUtils.jsx';

const ChartSidebar = ({ onClose }) => {
    const { t } = useTranslation();
    const tabs = [
        { id: 'vedic', label: t('Vedic') },
        { id: 'kp', label: t('KP') }
    ];
    const [activeTab, setActiveTab] = useState('vedic');

    const [birthDetails, setBirthDetails] = useState({
        year: '', month: '', day: '',
        hour: '', minute: '',
        latitude: '', longitude: ''
    });
    const [vedicChart, setVedicChart] = useState(null);
    const [kpData, setKpData] = useState(null);

    const handleChange = e => {
        const { name, value } = e.target;
        setBirthDetails(b => ({ ...b, [name]: value }));
    };

    const handleGenerate = async () => {
        const vc = await getVedicChart(birthDetails);
        setVedicChart(vc);
        const kp = getKPCalculations(vc);
        setKpData(kp);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-medium">{t('New Chart')}</h2>
                <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                    ×
                </button>
            </div>

            <div className="p-4 space-y-2">
                <input name="year" onChange={handleChange} placeholder={t('Year')} className="w-full p-2 border rounded" />
                <input name="month" onChange={handleChange} placeholder={t('Month')} className="w-full p-2 border rounded" />
                <input name="day" onChange={handleChange} placeholder={t('Day')} className="w-full p-2 border rounded" />
                <input name="hour" onChange={handleChange} placeholder={t('Hour')} className="w-full p-2 border rounded" />
                <input name="minute" onChange={handleChange} placeholder={t('Minute')} className="w-full p-2 border rounded" />
                <input name="latitude" onChange={handleChange} placeholder={t('Latitude')} className="w-full p-2 border rounded" />
                <input name="longitude" onChange={handleChange} placeholder={t('Longitude')} className="w-full p-2 border rounded" />

                <button
                    onClick={handleGenerate}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {t('Generate')}
                </button>
            </div>

            <div className="px-4">
                <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'vedic' && (
                    <VedicChartPanel vedicChart={vedicChart} />
                )}
                {activeTab === 'kp' && (
                    <KPChartPanel kpData={kpData} />
                )}
            </div>
        </div>
    );
};

export default ChartSidebar;
