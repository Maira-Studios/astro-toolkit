// src/pages/NewChart.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const NewChart = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        gender: 'male',
        date: '',
        time: '',
        place: '',
        latitude: '',
        longitude: '',
        timezone: ''
    });

    // Sample chart database
    const [savedCharts, setSavedCharts] = useState([
        {
            id: '1',
            name: 'John Doe',
            gender: 'male',
            date: '2025-04-15',
            time: '14:30',
            place: 'New York, USA',
            latitude: '40.7128° N',
            longitude: '74.0060° W',
            timezone: 'UTC-5'
        }
    ]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create a new chart entry
        const newChart = {
            id: Date.now().toString(),
            ...formData
        };

        // Add to saved charts
        setSavedCharts(prev => [...prev, newChart]);

        // Reset form or navigate to the generated chart
        console.log('Chart generated:', newChart);

        // Clear form after submission
        setFormData({
            name: '',
            gender: 'male',
            date: '',
            time: '',
            place: '',
            latitude: '',
            longitude: '',
            timezone: ''
        });
    };

    const handleDelete = (chartId) => {
        setSavedCharts(prev => prev.filter(chart => chart.id !== chartId));
    };

    const handleView = (chartId) => {
        const chart = savedCharts.find(c => c.id === chartId);
        console.log('Viewing chart:', chart);
        // Here you would implement the logic to display the selected chart
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">{t('New Chart')}</h1>

            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name input */}
                        <div>
                            <label className="block text-gray-700 mb-2">{t('Name')}</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder={t('Enter name')}
                                required
                            />
                        </div>

                        {/* Gender selection */}
                        <div>
                            <label className="block text-gray-700 mb-2">{t('Gender')}</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="male">{t('Male')}</option>
                                <option value="female">{t('Female')}</option>
                                <option value="other">{t('Other')}</option>
                            </select>
                        </div>

                        {/* Date input */}
                        <div>
                            <label className="block text-gray-700 mb-2">{t('Date of Birth')}</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        {/* Time input */}
                        <div>
                            <label className="block text-gray-700 mb-2">{t('Time of Birth')}</label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        {/* Place input */}
                        <div>
                            <label className="block text-gray-700 mb-2">{t('Place of Birth')}</label>
                            <input
                                type="text"
                                name="place"
                                value={formData.place}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder={t('Enter city, state, country')}
                                required
                            />
                        </div>

                        {/* Latitude input */}
                        <div>
                            <label className="block text-gray-700 mb-2">{t('Latitude')}</label>
                            <input
                                type="text"
                                name="latitude"
                                value={formData.latitude}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="e.g., 40.7128° N"
                            />
                        </div>

                        {/* Longitude input */}
                        <div>
                            <label className="block text-gray-700 mb-2">{t('Longitude')}</label>
                            <input
                                type="text"
                                name="longitude"
                                value={formData.longitude}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="e.g., 74.0060° W"
                            />
                        </div>

                        {/* Timezone input */}
                        <div>
                            <label className="block text-gray-700 mb-2">{t('Timezone')}</label>
                            <select
                                name="timezone"
                                value={formData.timezone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">{t('Select timezone')}</option>
                                <option value="UTC-12">UTC-12</option>
                                <option value="UTC-11">UTC-11</option>
                                <option value="UTC-10">UTC-10</option>
                                <option value="UTC-9">UTC-9</option>
                                <option value="UTC-8">UTC-8</option>
                                <option value="UTC-7">UTC-7</option>
                                <option value="UTC-6">UTC-6</option>
                                <option value="UTC-5">UTC-5</option>
                                <option value="UTC-4">UTC-4</option>
                                <option value="UTC-3">UTC-3</option>
                                <option value="UTC-2">UTC-2</option>
                                <option value="UTC-1">UTC-1</option>
                                <option value="UTC+0">UTC+0</option>
                                <option value="UTC+1">UTC+1</option>
                                <option value="UTC+2">UTC+2</option>
                                <option value="UTC+3">UTC+3</option>
                                <option value="UTC+4">UTC+4</option>
                                <option value="UTC+5">UTC+5</option>
                                <option value="UTC+5:30">UTC+5:30 (IST)</option>
                                <option value="UTC+6">UTC+6</option>
                                <option value="UTC+7">UTC+7</option>
                                <option value="UTC+8">UTC+8</option>
                                <option value="UTC+9">UTC+9</option>
                                <option value="UTC+10">UTC+10</option>
                                <option value="UTC+11">UTC+11</option>
                                <option value="UTC+12">UTC+12</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {t('Generate Chart')}
                        </button>
                    </div>
                </form>

                {/* Chart database - list of previously saved charts */}
                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-4">{t('Saved Charts')}</h2>
                    <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Name')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Date & Time')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Location')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('Actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {savedCharts.map(chart => (
                                    <tr key={chart.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{chart.name}</div>
                                            <div className="text-sm text-gray-500">{chart.gender}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{chart.date} {chart.time}</div>
                                            <div className="text-sm text-gray-500">{chart.timezone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{chart.place}</div>
                                            <div className="text-sm text-gray-500">
                                                {chart.latitude && chart.longitude ? `${chart.latitude}, ${chart.longitude}` : ''}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                                onClick={() => handleView(chart.id)}
                                            >
                                                {t('View')}
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => handleDelete(chart.id)}
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
            </div>
        </div>
    );
};

export default NewChart;