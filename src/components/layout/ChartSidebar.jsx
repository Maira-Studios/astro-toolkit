// src/components/layout/ChartSidebar.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TabSelector from '../common/TabSelector.jsx';
import VedicChartPanel from './VedicChartPanel.jsx';
import KPChartPanel from './KPChartPanel.jsx';
import PlaceholderComponent from '../common/PlaceholderComponent.jsx';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
} from 'react-places-autocomplete';

const ChartSidebar = ({ inSidebar = false }) => {
    const { t } = useTranslation();
    const tabs = [
        { id: 'vedic', label: t('Vedic') },
        { id: 'kp', label: t('KP') }
    ];

    const [activeTab, setActiveTab] = useState('vedic');
    const [birthDetails, setBirthDetails] = useState({
        name: '', // Added name field
        date: '', // yyyy-mm-dd
        time: '', // hh:mm
        latitude: '',
        longitude: ''
    });
    const [address, setAddress] = useState('');
    const [vedicChart, setVedicChart] = useState(null);
    const [kpData, setKpData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;
        setBirthDetails(b => ({ ...b, [name]: value }));
    };

    const handleSelect = async addr => {
        setAddress(addr);
        const results = await geocodeByAddress(addr);
        const { lat, lng } = await getLatLng(results[0]);
        setBirthDetails(b => ({ ...b, latitude: lat, longitude: lng }));
    };

    const handleGenerate = async () => {
        if (!birthDetails.name || !birthDetails.date || !birthDetails.time || !address) {
            alert('Please enter name, date, time and select a location.');
            return;
        }

        let { latitude, longitude } = birthDetails;
        if (!latitude) {
            try {
                const results = await geocodeByAddress(address);
                const coords = await getLatLng(results[0]);
                latitude = coords.lat;
                longitude = coords.lng;
            } catch {
                alert('Could not determine coordinates.');
                return;
            }
        }

        setLoading(true);
        const [year, month, day] = birthDetails.date.split('-');
        const [hour, minute] = birthDetails.time.split(':');

        try {
            const res = await fetch('http://localhost:3001/chart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: birthDetails.name,
                    year, month, day,
                    hour, minute,
                    latitude, longitude
                })
            });
            const { vedic, kp } = await res.json();
            setVedicChart(vedic);
            setKpData(kp);
        } catch {
            alert('Failed to generate chart.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={inSidebar ? "flex flex-col h-full" : "max-w-3xl mx-auto"}>
            <div className="p-4 bg-white rounded-lg shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">{t('Birth Details')}</h2>

                {/* Form Layout - Modified for better page layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name field */}
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('Name')}</label>
                        <input
                            type="text"
                            name="name"
                            value={birthDetails.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder={t('Enter name')}
                        />
                    </div>

                    {/* Date and time in one row */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('Date of Birth')}</label>
                        <input
                            type="date"
                            name="date"
                            value={birthDetails.date}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('Time of Birth')}</label>
                        <input
                            type="time"
                            name="time"
                            value={birthDetails.time}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* Location search */}
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('Place of Birth')}</label>
                        <PlacesAutocomplete
                            value={address}
                            onChange={setAddress}
                            onSelect={handleSelect}
                            searchOptions={{ types: ['(cities)'] }}
                            debounce={300}
                        >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <div className="relative">
                                    <input
                                        {...getInputProps({
                                            placeholder: 'Search location',
                                            className: 'w-full p-2 border rounded'
                                        })}
                                    />
                                    {suggestions.length > 0 && (
                                        <div className="absolute z-50 bg-white border mt-1 w-full">
                                            {loading && <div className="p-2">Loading...</div>}
                                            {suggestions.map(s => (
                                                <div
                                                    key={s.placeId}
                                                    {...getSuggestionItemProps(s, {
                                                        className: 'p-2 hover:bg-gray-100'
                                                    })}
                                                >
                                                    {s.description}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </PlacesAutocomplete>
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? t('Generating…') : t('Generate Chart')}
                </button>
            </div>

            {/* Sample chart list */}
            {!inSidebar && (
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <h2 className="text-xl font-semibold mb-4">{t('Saved Charts')}</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Name')}
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Date & Time')}
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Location')}
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {/* Sample saved chart */}
                                <tr>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">John Doe</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">2025-04-15 14:30</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">New York, USA</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                                            {t('View')}
                                        </button>
                                        <button className="text-red-600 hover:text-red-900">
                                            {t('Delete')}
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">Jane Smith</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">2025-03-22 09:15</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">London, UK</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                                            {t('View')}
                                        </button>
                                        <button className="text-red-600 hover:text-red-900">
                                            {t('Delete')}
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Chart display section */}
            {(vedicChart || kpData) && (
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="px-4 py-2">
                        <TabSelector
                            tabs={tabs}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />
                    </div>
                    <div className="p-4">
                        {activeTab === 'vedic' && (
                            vedicChart
                                ? <VedicChartPanel vedicChart={vedicChart} />
                                : <PlaceholderComponent
                                    title={t('No data')}
                                    message={t('Generate a chart to view Vedic positions')}
                                />
                        )}
                        {activeTab === 'kp' && (
                            kpData
                                ? <KPChartPanel kpData={kpData} />
                                : <PlaceholderComponent
                                    title={t('No data')}
                                    message={t('Generate a chart to view KP calculations')}
                                />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChartSidebar;