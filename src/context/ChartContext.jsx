// src/context/ChartContext.jsx
import React, { createContext, useState, useContext } from 'react';

const ChartContext = createContext();

export const useChartContext = () => useContext(ChartContext);

export const ChartProvider = ({ children }) => {
    const [charts, setCharts] = useState([]);
    const [currentChart, setCurrentChart] = useState(null);

    // Add a new chart
    const addChart = (chartData) => {
        const newChart = {
            id: Date.now().toString(),
            created: new Date(),
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
            setCurrentChart(null);
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
            setCurrentChart
        }}>
            {children}
        </ChartContext.Provider>
    );
};

export default ChartProvider;