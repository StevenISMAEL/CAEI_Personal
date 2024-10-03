import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale,ArcElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { DarkModeContext } from "@/Components/DarkModeContext";

// Registrar los componentes necesarios
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,ArcElement);

// Definimos los estados y sus colores
const estadosConfig = {
    "Aprobado": { color: "rgba(238, 102, 102, 1)", borderColor: "rgba(226, 16, 16, 1)" },
    "Revisión": { color: "rgba(112, 176, 247, 1)", borderColor: "rgba(9, 73, 145, 1)" },
    "Observación": { color: "rgba(153, 102, 255, 0.6)", borderColor: "rgba(153, 102, 255, 1)" },
    "Negado": {color: "rgba(255, 99, 132, 0.6)", borderColor: "rgba(255, 99, 132, 1)" }
};

export const TramitesEstadoChart = ({ data }) => {
    const { isDarkMode } = useContext(DarkModeContext);

    // Aseguramos que todos los estados estén presentes en los datos
    const chartData = {
        labels: Object.keys(estadosConfig),
        datasets: [
            {
                label: "Nro de Trámites",
                data: Object.keys(estadosConfig).map(estado => data[estado] || 0),
                backgroundColor: Object.values(estadosConfig).map(config => config.color),
                borderColor: Object.values(estadosConfig).map(config => config.borderColor),
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: " Trámites por Estado",
                color: isDarkMode ? "white" : "var(--text-color)",
                font: {
                    size: 18,
                    weight: 'bold'
                }
            },
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y + ' trámite' + (context.parsed.y !== 1 ? 's' : '');
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: isDarkMode ? "white" : "var(--text-color)",
                },
                grid: {
                    color: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
                },
            },
            y: {
                ticks: {
                    color: isDarkMode ? "white" : "var(--text-color)",
                    beginAtZero: true,
                    precision: 0
                },
                grid: {
                    color: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
                },
                title: {
                    display: true,
                    text: 'Cantidad de Trámites',
                    color: isDarkMode ? "white" : "var(--text-color)",
                }
            },
        },
    };

    return (
        <div className="w-full h-full">
            <div className="bg-white dark:bg-gray-700 dark:text-white p-4 rounded-lg shadow-lg h-full">
                <div className="relative" style={{ height: "400px" }}>
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default TramitesEstadoChart;

import { Pie } from "react-chartjs-2";



const generateSoftColors = (count) => {
    const colors = [];
    const saturation = 70; // Disminuir la saturación para colores menos intensos
    const lightness = 70;  // Aumentar la luminosidad para tonos más claros

    for (let i = 0; i < count; i++) {
        const hue = (i * 360) / count; // Espaciado uniforme en el círculo de color
        colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
};

const generateBorderColors = (count) => {
    const colors = [];
    const saturation = 60; // Ajustar para bordes más oscuros
    const lightness = 40;  // Ajustar para bordes más oscuros

    for (let i = 0; i < count; i++) {
        const hue = (i * 360) / count; // Espaciado uniforme en el círculo de color
        colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
};


const shortenLabel = (label, maxLength = 15) => {
    return label.length > maxLength ? label.slice(0, maxLength) + '...' : label;
};

export const PieChart = ({ data }) => {
    const { isDarkMode } = useContext(DarkModeContext);

    // Agrupar y sumar los totales por categoría
    const groupedData = data.reduce((acc, item) => {
        const category = item.nombre_categoria;
        if (!acc[category]) {
            acc[category] = {
                nombre_categoria: category,
                total: 0,
            };
        }
        acc[category].total += item.total;
        return acc;
    }, {});

    // Convertir el objeto agrupado de nuevo a un arreglo
    const chartDataArray = Object.values(groupedData);

    // Prepara los datos para el gráfico
    const chartData = {
        labels: chartDataArray.map((item) => shortenLabel(item.nombre_categoria)),
        datasets: [
            {
                label: "# trámites por categoría",
                data: chartDataArray.map((item) => item.total),
                backgroundColor: generateSoftColors(chartDataArray.length),
                borderColor: generateBorderColors(chartDataArray.length),
                borderWidth: 2,
            },
        ],
    };

    // Configuración del gráfico
    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: "# Trámites por categoría",
                color: isDarkMode ? "white" : "var(--text-color)",
                font: {
                    size: 18,
                    weight: 'bold'
                },
            },
            legend: {
                position: 'right', // Cambia la posición de la leyenda a la derecha
                labels: {
                    color: isDarkMode ? "white" : "var(--text-color)",
                    boxWidth: 10, // Reduce el ancho de las cajas de color
                    padding: 5, // Reduce el padding entre elementos
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label;
                        const value = context.formattedValue;
                        return `${chartDataArray[context.dataIndex].nombre_categoria}: ${value}`;
                    }
                }
            }
        },
    };

    return (
        <div className="w-full h-full">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg h-full">
                <Pie data={chartData} options={pieOptions} />
            </div>
        </div>
    );
};