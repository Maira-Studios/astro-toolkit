import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ChartContext = createContext();

export const ChartProvider = ({ children }) => {
    const [charts, setCharts] = useState([]);
    const [currentChart, setCurrentChart] = useState({ id: null, vedic: null, kp: null });

    const addChart = (chartData) => {
        const id = uuidv4();
        const newChart = { id, ...chartData };
        setCharts((prev) => [...prev, newChart]);
        return newChart;
    };

    const loadChart = (chartOrId) => {
        const chart = typeof chartOrId === 'string'
            ? charts.find((c) => c.id === chartOrId)
            : chartOrId;
        if (chart) {
            setCurrentChart({ id: chart.id, vedic: chart.vedicData, kp: chart.kpData });
        }
    };

    const deleteChart = (id) => {
        setCharts((prev) => prev.filter((c) => c.id !== id));
        setCurrentChart({ vedic: null, kp: null });
    };

    return (
        <ChartContext.Provider
            value={{ charts, currentChart, addChart, loadChart, deleteChart }}
        >
            {children}
        </ChartContext.Provider>
    );
};

export const useChartContext = () => useContext(ChartContext);
export default ChartProvider;
