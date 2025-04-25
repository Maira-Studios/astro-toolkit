// src/components/layout/ChartSidebar.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import TabSelector from '../common/TabSelector.jsx';
import VedicChartPanel from './VedicChartPanel.jsx';
import KPChartPanel from './KPChartPanel.jsx';
import PlaceholderComponent from '../common/PlaceholderComponent.jsx';
import { useChartContext } from '../../context/ChartContext.jsx'; // Import the context hook
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
} from 'react-places-autocomplete';

// Define API URL based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const ChartSidebar = ({ inSidebar = false, onChartCreated = null }) => {
    const { t } = useTranslation();
    const { addChart, charts, deleteChart, loadChart } = useChartContext(); // Use the chart context

    const tabs = [
        { id: 'vedic', label: t('Vedic') },
        { id: 'kp', label: t('KP') }
    ];

    const [activeTab, setActiveTab] = useState('vedic');
    const [birthDetails, setBirthDetails] = useState({
        name: '',
        date: '',
        time: '',
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
            } catch (error) {
                console.error('Geocoding error:', error);
                alert('Could not determine coordinates.');
                return;
            }
        }

        setLoading(true);
        const [year, month, day] = birthDetails.date.split('-');
        const [hour, minute] = birthDetails.time.split(':');

        try {
            const res = await fetch(`${API_BASE_URL}/chart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: birthDetails.name,
                    year, month, day,
                    hour, minute,
                    latitude, longitude
                })
            });

            if (!res.ok) {
                throw new Error(`Server responded with status: ${res.status}`);
            }

            const data = await res.json();

            if (!data || !data.vedic || !data.kp) {
                throw new Error('Invalid response format from server');
            }

            setVedicChart(data.vedic);
            setKpData(data.kp);

            // Add the new chart to context
            const newChart = addChart({
                name: birthDetails.name,
                date: birthDetails.date,
                time: birthDetails.time,
                location: address,
                latitude,
                longitude,
                vedicData: data.vedic,
                kpData: data.kp
            });

            // Call the callback if provided (e.g., to navigate or update parent)
            if (onChartCreated) {
                onChartCreated(newChart);
            }

            // Reset form if in the sidebar to create another chart
            if (inSidebar) {
                setBirthDetails({
                    name: '',
                    date: '',
                    time: '',
                    latitude: '',
                    longitude: ''
                });
                setAddress('');
            }

        } catch (error) {
            console.error('Chart generation error:', error);
            alert(`Failed to generate chart: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle chart deletion
    const handleDeleteChart = (chartId) => {
        if (window.confirm(t('Are you sure you want to delete this chart?'))) {
            deleteChart(chartId);
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
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('Generating…')}
                        </span>
                    ) : t('Generate Chart')}
                </button>
            </div>

            {/* Saved charts list - only show if not in sidebar and there are charts */}
            {!inSidebar && charts.length > 0 && (
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
                                {charts.map(chart => (
                                    <tr key={chart.id}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">{chart.name}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                                            {chart.date} {chart.time}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">{chart.location}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                                            <button
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                                onClick={() => loadChart(chart.id)}
                                            >
                                                {t('View')}
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => handleDeleteChart(chart.id)}
                                            >
                                                {t('Delete')}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Show a message if no charts exist and not in sidebar */}
            {!inSidebar && charts.length === 0 && !vedicChart && !kpData && (
                <div className="bg-white rounded-lg shadow p-6 mb-6 text-center">
                    <div className="text-gray-400 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <p className="text-gray-600">{t('No saved charts yet. Create your first chart above.')}</p>
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