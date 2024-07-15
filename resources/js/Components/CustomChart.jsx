import React, { useContext } from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
} from "chart.js";
import { DarkModeContext } from "@/Components/DarkModeContext"; 

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
);

const chartOptions = (title, isDarkMode) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: title,
            color: isDarkMode ? "white" : "var(--text-color)",
        },
        legend: {
            labels: {
                color: isDarkMode ? "white" : "var(--text-color)",
            },
        },
    },
    scales: {
        x: {
            ticks: {
                color: isDarkMode ? "white" : "var(--text-color)",
            },
            grid: {
                color: isDarkMode
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(0, 0, 0, 0.1)",
            },
        },
        y: {
            ticks: {
                color: isDarkMode ? "white" : "var(--text-color)",
            },
            grid: {
                color: isDarkMode
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(0, 0, 0, 0.1)",
            },
        },
    },
});

const pieChartOptions = (title, isDarkMode) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: title,
            color: isDarkMode ? "white" : "var(--text-color)",
        },
        legend: {
            labels: {
                color: isDarkMode ? "white" : "var(--text-color)",
            },
        },
    },
});

export const RoleActivityChart = ({ data }) => {
    const { isDarkMode } = useContext(DarkModeContext);

    return (
        <div className="w-full h-full">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg h-full">
                <Pie
                    data={data}
                    options={pieChartOptions("Actividad por Rol", isDarkMode)}
                />
            </div>
        </div>
    );
};

export const EntityActivityChart = ({ data }) => {
    const { isDarkMode } = useContext(DarkModeContext);

    return (
        <div className="w-full h-full">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg h-full">
                <Bar
                    data={data}
                    options={{
                        ...chartOptions("Actividad por Entidad", isDarkMode),
                        indexAxis: "y",
                    }}
                />
            </div>
        </div>
    );
};

export const TimelineChart = ({ data }) => {
    const { isDarkMode } = useContext(DarkModeContext);

    return (
        <div className="w-full h-full">
            <div className="bg-white dark:bg-gray-700 dark:text-white p-4 rounded-lg shadow-lg h-full">
                <Line
                    data={data}
                    options={chartOptions(
                        "Línea de Tiempo de Actividad",
                        isDarkMode,
                    )}
                />
            </div>
        </div>
    );
};
