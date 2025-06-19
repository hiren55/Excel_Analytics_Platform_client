import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    BarChart,
    LineChart,
    PieChart,
    ScatterChart,
    BarChart3,
    LineChart as LineChartIcon,
    PieChart as PieChartIcon,
    ScatterChart as ScatterChartIcon,
    Download,
    Home,
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import { useToast } from '../../../components/ui/use-toast';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const chartTypes = [
    {
        type: 'bar',
        label: 'Bar Chart',
        icon: BarChart3,
        description: 'Compare values across categories',
    },
    {
        type: 'line',
        label: 'Line Chart',
        icon: LineChartIcon,
        description: 'Show trends over time',
    },
    {
        type: 'pie',
        label: 'Pie Chart',
        icon: PieChartIcon,
        description: 'Display proportions of a whole',
    },
    {
        type: 'scatter',
        label: 'Scatter Plot',
        icon: ScatterChartIcon,
        description: 'Show relationships between variables',
    },
];

const ChartGenerator = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [selectedType, setSelectedType] = useState('bar');
    const [chartData, setChartData] = useState(null);
    const [chartOptions, setChartOptions] = useState({
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart Title',
            },
        },
    });
    const chartRef = useRef(null);

    // Sample data - replace with your actual data
    const generateSampleData = (type) => {
        const labels = ['January', 'February', 'March', 'April', 'May', 'June'];
        const data = {
            labels,
            datasets: [
                {
                    label: 'Dataset 1',
                    data: labels.map(() => Math.random() * 100),
                    backgroundColor: 'rgba(147, 51, 234, 0.5)',
                    borderColor: 'rgb(147, 51, 234)',
                    borderWidth: 1,
                },
                {
                    label: 'Dataset 2',
                    data: labels.map(() => Math.random() * 100),
                    backgroundColor: 'rgba(236, 72, 153, 0.5)',
                    borderColor: 'rgb(236, 72, 153)',
                    borderWidth: 1,
                },
            ],
        };

        switch (type) {
            case 'bar':
                return data;
            case 'line':
                return {
                    ...data,
                    datasets: data.datasets.map(dataset => ({
                        ...dataset,
                        tension: 0.4,
                    })),
                };
            case 'pie':
                return {
                    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                    datasets: [{
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                            'rgba(75, 192, 192, 0.5)',
                            'rgba(153, 102, 255, 0.5)',
                            'rgba(255, 159, 64, 0.5)',
                        ],
                        borderColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 206, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(153, 102, 255)',
                            'rgb(255, 159, 64)',
                        ],
                        borderWidth: 1,
                    }],
                };
            case 'scatter':
                return {
                    datasets: [{
                        label: 'Dataset 1',
                        data: Array.from({ length: 20 }, () => ({
                            x: Math.random() * 100,
                            y: Math.random() * 100,
                        })),
                        backgroundColor: 'rgba(147, 51, 234, 0.5)',
                    }],
                };
            default:
                return data;
        }
    };

    useEffect(() => {
        setChartData(generateSampleData(selectedType));
    }, [selectedType]);

    const handleChartTypeChange = (type) => {
        setSelectedType(type);
        showToast(`Switched to ${type} chart`, 'success');
    };

    const handleDownload = () => {
        if (!chartRef.current) return;

        const canvas = chartRef.current.canvas;
        const image = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = `chart-${selectedType}-${new Date().toISOString().split('T')[0]}.png`;
        link.href = image;
        link.click();
        showToast('Chart downloaded successfully!', 'success');
    };

    const handleGoHome = () => {
        navigate('/');
        showToast('Returning to home page', 'info');
    };

    const renderChart = () => {
        if (!chartData) return null;

        const chartProps = {
            ref: chartRef,
            data: chartData,
            options: chartOptions,
        };

        switch (selectedType) {
            case 'bar':
                return <Bar {...chartProps} />;
            case 'line':
                return <Line {...chartProps} />;
            case 'pie':
                return <Pie {...chartProps} />;
            case 'scatter':
                return <Scatter {...chartProps} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold mb-4">Chart Generator</h1>
                            <p className="text-gray-400">Create beautiful, interactive charts from your data</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleGoHome}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            <Home className="w-5 h-5" />
                            <span>Back to Home</span>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Chart Type Selection */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {chartTypes.map((chart) => (
                        <motion.button
                            key={chart.type}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleChartTypeChange(chart.type)}
                            className={`p-4 rounded-lg flex flex-col items-center ${selectedType === chart.type
                                ? 'bg-purple-600'
                                : 'bg-gray-800 hover:bg-gray-700'
                                }`}
                        >
                            <chart.icon className="w-8 h-8 mb-2" />
                            <span className="font-semibold">{chart.label}</span>
                            <span className="text-sm text-gray-400 text-center mt-1">
                                {chart.description}
                            </span>
                        </motion.button>
                    ))}
                </div>

                {/* Chart Display */}
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Chart Preview</h2>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            <span>Download Chart</span>
                        </motion.button>
                    </div>
                    <div className="aspect-[2/1] w-full">
                        {renderChart()}
                    </div>
                </div>

                {/* Chart Controls */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Chart Controls</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Chart Title
                            </label>
                            <input
                                type="text"
                                value={chartOptions.plugins.title.text}
                                onChange={(e) =>
                                    setChartOptions({
                                        ...chartOptions,
                                        plugins: {
                                            ...chartOptions.plugins,
                                            title: {
                                                ...chartOptions.plugins.title,
                                                text: e.target.value,
                                            },
                                        },
                                    })
                                }
                                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Legend Position
                            </label>
                            <select
                                value={chartOptions.plugins.legend.position}
                                onChange={(e) =>
                                    setChartOptions({
                                        ...chartOptions,
                                        plugins: {
                                            ...chartOptions.plugins,
                                            legend: {
                                                ...chartOptions.plugins.legend,
                                                position: e.target.value,
                                            },
                                        },
                                    })
                                }
                                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            >
                                <option value="top">Top</option>
                                <option value="bottom">Bottom</option>
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChartGenerator; 