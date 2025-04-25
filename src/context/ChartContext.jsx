// src/context/ChartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const ChartContext = createContext();

export const useChartContext = () => useContext(ChartContext);

export const ChartProvider = ({ children }) => {
    // Initialize state from localStorage if available
    const [charts, setCharts] = useState(() => {
        const savedCharts = localStorage.getItem('astroCharts');
        return savedCharts ? JSON.parse(savedCharts) : [];
    });

    const [currentChart, setCurrentChart] = useState(null);

    // Save charts to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('astroCharts', JSON.stringify(charts));
    }, [charts]);

    // Set current chart to the first one if it exists and none is selected
    useEffect(() => {
        if (!currentChart && charts.length > 0) {
            setCurrentChart(charts[0]);
        }
    }, [charts, currentChart]);

    // Add a new chart
    const addChart = (chartData) => {
        const newChart = {
            id: Date.now().toString(),
            created: new Date().toISOString(),
            ...chartData
        };

        setCharts(prev => [...prev, newChart]);
        setCurrentChart(newChart);
        return newChart;
    };

    // Load a chart by ID
    const loadChart = (chartId) => {
        const chart = charts.find(c => c.id === chartId);
        if (chart) {
            setCurrentChart(chart);
        }
        return chart;
    };

    // Update a chart
    const updateChart = (chartId, updates) => {
        setCharts(prev => prev.map(chart =>
            chart.id === chartId ? { ...chart, ...updates } : chart
        ));

        if (currentChart?.id === chartId) {
            setCurrentChart(prev => ({ ...prev, ...updates }));
        }
    };

    // Delete a chart
    const deleteChart = (chartId) => {
        setCharts(prev => prev.filter(chart => chart.id !== chartId));

        if (currentChart?.id === chartId) {
            // Set current chart to the first available chart or null
            const remainingCharts = charts.filter(chart => chart.id !== chartId);
            setCurrentChart(remainingCharts.length > 0 ? remainingCharts[0] : null);
        }
    };

    // Get count of charts
    const getChartCount = () => charts.length;

    // Clear all charts (for testing or reset)
    const clearAllCharts = () => {
        if (window.confirm('Are you sure you want to delete all charts? This cannot be undone.')) {
            setCharts([]);
            setCurrentChart(null);
            localStorage.removeItem('astroCharts');
        }
    };

    return (
        <ChartContext.Provider value={{
            charts,
            currentChart,
            addChart,
            loadChart,
            updateChart,
            deleteChart,
            setCurrentChart,
            getChartCount,
            clearAllCharts
        }}>
            {children}
        </ChartContext.Provider>
    );
};

export default ChartProvider;