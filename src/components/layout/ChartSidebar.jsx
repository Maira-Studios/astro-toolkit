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

const ChartSidebar = () => {
    const { t } = useTranslation();
    const tabs = [
        { id: 'vedic', label: t('Vedic') },
        { id: 'kp', label: t('KP') }
    ];

    const [activeTab, setActiveTab] = useState('vedic');
    const [birthDetails, setBirthDetails] = useState({
        date: '',     // yyyy‑mm‑dd
        time: '',     // hh:mm
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
        if (!birthDetails.date || !birthDetails.time || !address) {
            alert('Please enter date, time and select a location.');
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
        <>
            <a
                href="#"
                onClick={() => {
                    const now = new Date();
                    const defaultDate = now.toISOString().split('T')[0];
                    const defaultTime = now.toTimeString().slice(0, 5);
                    setBirthDetails(b => ({
                        ...b,
                        date: defaultDate,
                        time: defaultTime,
                        latitude: '',
                        longitude: ''
                    }));
                    setAddress('');
                }}
                className="text-blue-500 hover:underline text-sm mt-1 block"
            >
                Current Transit Chart
            </a>

            <div className="flex flex-col h-full">
                <div className="p-4 space-y-3 border-b">
                    <input
                        type="date"
                        name="date"
                        value={birthDetails.date}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="time"
                        name="time"
                        value={birthDetails.time}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
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

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? t('Generating…') : t('Generate')}
                    </button>
                </div>

                <div className="px-4 py-2">
                    <TabSelector
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </div>

                <div className="flex-1 overflow-y-auto p-4">
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
        </>);
};

export default ChartSidebar;
