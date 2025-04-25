import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import VedicChartPanel from './VedicChartPanel.jsx';
import KPChartPanel from './KPChartPanel.jsx';
import PlaceholderComponent from '../common/PlaceholderComponent.jsx';
import { useChartContext } from '../../context/ChartContext.jsx';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

const ChartSidebar = ({ inSidebar = false, onChartCreated = null }) => {
    const { t } = useTranslation();
    const { charts, addChart, deleteChart, loadChart, currentChart } = useChartContext();

    const [activeTab, setActiveTab] = useState('vedic');
    const [birthDetails, setBirthDetails] = useState({ name: '', date: '', time: '', latitude: '', longitude: '' });
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBirthDetails((b) => ({ ...b, [name]: value }));
    };

    const handleSelect = async (addr) => {
        setAddress(addr);
        const results = await geocodeByAddress(addr);
        const { lat, lng } = await getLatLng(results[0]);
        setBirthDetails((b) => ({ ...b, latitude: lat, longitude: lng }));
    };

    const handleGenerate = async () => {
        if (!birthDetails.name || !birthDetails.date || !birthDetails.time || !address) {
            alert('Please complete all fields.');
            return;
        }

        let { latitude, longitude } = birthDetails;
        if (!latitude || !longitude) {
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
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/chart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: birthDetails.name, year, month, day, hour, minute, latitude, longitude })
            });
            if (!res.ok) throw new Error(`Status ${res.status}`);

            const data = await res.json();
            //const newChart = addChart({ ...birthDetails, location: address, vedicData: data.vedic, kpData: data.kp });
            //loadChart(newChart.id);
            const newChart = addChart({ ...birthDetails, vedicData: data.vedic, kpData: data.kp });
            loadChart(newChart);
            onChartCreated?.(newChart);
            if (inSidebar) setBirthDetails({ name: '', date: '', time: '', latitude: '', longitude: '' }); setAddress('');
        } catch (err) {
            alert(`Generation failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm(t('Delete this chart?'))) deleteChart(id);
    };

    return (
        <div className={inSidebar ? 'flex flex-col h-full' : 'max-w-3xl mx-auto'}>
            {/* Form */}
            <div className="p-4 bg-white rounded shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">{t('Birth Details')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-full">
                        <label className="block text-sm mb-1">{t('Name')}</label>
                        <input name="name" value={birthDetails.name} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">{t('Date of Birth')}</label>
                        <input type="date" name="date" value={birthDetails.date} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">{t('Time of Birth')}</label>
                        <input type="time" name="time" value={birthDetails.time} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                    <div className="col-span-full">
                        <label className="block text-sm mb-1">{t('Place of Birth')}</label>
                        <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect} debounce={300}>
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <div className="relative">
                                    <input {...getInputProps({ placeholder: t('Search location'), className: 'w-full p-2 border rounded' })} />
                                    {suggestions.length > 0 && (
                                        <div className="absolute bg-white border mt-1 w-full z-50">
                                            {loading && <div className="p-2">{t('Loading...')}</div>}
                                            {suggestions.map(s => <div key={s.placeId} {...getSuggestionItemProps(s)} className="p-2 hover:bg-gray-100">{s.description}</div>)}
                                        </div>
                                    )}
                                </div>
                            )}
                        </PlacesAutocomplete>
                    </div>
                </div>
                <button onClick={handleGenerate} disabled={loading} className="w-full mt-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
                    {loading ? t('Generating…') : t('Generate Chart')}
                </button>
            </div>

            {/* Saved Charts */}
            {!inSidebar && (
                <div className="bg-white rounded shadow p-4 mb-6">
                    <h2 className="text-xl font-semibold mb-4">{t('Saved Charts')}</h2>
                    {charts.length === 0 ? (
                        <p className="text-gray-600">{t('No saved charts yet.')}</p>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Active')}
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Name')}
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Date & Time')}
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Actions')}
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {charts.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                                            {currentChart.id === c.id && (
                                                <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded">
                                                    {t('Active')}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">{c.name}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                                            {c.date} {c.time}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm space-x-2">
                                            <button
                                                onClick={() => loadChart(c.id)}
                                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                            >
                                                {t('Load')}
                                            </button>
                                            <button
                                                onClick={() => deleteChart(c.id)}
                                                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                            >
                                                {t('Delete')}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>


                        </table>
                    )}
                </div>
            )}

            {/* Chart Panels */}
            {(currentChart.vedic || currentChart.kp) && (
                <div className="bg-white rounded shadow p-4">
                    <div className="flex border-b mb-4">
                        <button onClick={() => setActiveTab('vedic')} className={`px-4 py-2 ${activeTab === 'vedic' ? 'border-b-2 border-blue-500' : ''}`}>{t('Vedic')}</button>
                        <button onClick={() => setActiveTab('kp')} className={`px-4 py-2 ${activeTab === 'kp' ? 'border-b-2 border-blue-500' : ''}`}>{t('KP')}</button>
                    </div>
                    {activeTab === 'vedic' ? <VedicChartPanel vedicChart={currentChart.vedic} /> : <KPChartPanel kpData={currentChart.kp} />}
                </div>
            )}
        </div>
    );
};

export default ChartSidebar;
