import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
    BarChart3,
    LineChart,
    PieChart,
    ScatterChart,
    Settings,
    Download,
    Share2,
    ChevronRight,
    Home,
    FileText,
    Play,
    Loader2,
    Image,
    FileDown,
    ChevronDown,
    ChevronUp,
    Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/use-toast';
import { dataAPI } from '../../services/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const chartTypes = [
    { id: 'bar', name: 'Bar Chart', icon: BarChart3, component: Bar },
    { id: 'line', name: 'Line Chart', icon: LineChart, component: Line },
    { id: 'pie', name: 'Pie Chart', icon: PieChart, component: Pie },
    { id: 'scatter', name: 'Scatter Plot', icon: ScatterChart, component: Scatter },
];

const ChartPage = () => {
    const [selectedChart, setSelectedChart] = useState('bar');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [chartTitle, setChartTitle] = useState('');
    const [fileData, setFileData] = useState(null);
    const [selectedColumns, setSelectedColumns] = useState({ x: '', y: '' });
    const [showColumnSelector, setShowColumnSelector] = useState(false);
    const [maxRows, setMaxRows] = useState(50);
    const { user } = useAuth();
    const { showToast } = useToast();
    const location = useLocation();
    const chartRef = useRef(null);

    useEffect(() => {
        loadUploadedFiles();

        // Check if a file was passed from History page
        if (location.state?.selectedFile) {
            setSelectedFile(location.state.selectedFile);
        }

        // Add custom CSS for dropdown styling
        const style = document.createElement('style');
        style.textContent = `
            select option {
                background-color: #1f2937 !important;
                color: #ffffff !important;
                padding: 8px 12px !important;
            }
            select option:hover {
                background-color: #7c3aed !important;
            }
            select option:checked {
                background-color: #7c3aed !important;
            }
            select:focus {
                border-color: #a855f7 !important;
                box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2) !important;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, [location.state]);

    // Auto-regenerate chart when column selection changes
    useEffect(() => {
        if (selectedFile && selectedColumns.x && selectedColumns.y && fileData) {
            // Small delay to avoid too many API calls
            const timer = setTimeout(() => {
                handleGenerateChart();
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [selectedColumns.x, selectedColumns.y, maxRows]);

    // Add custom styles for dropdown
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .custom-select option {
                background-color: #1f2937 !important;
                color: #ffffff !important;
                padding: 8px 12px !important;
            }
            .custom-select option:hover {
                background-color: #7c3aed !important;
                color: #ffffff !important;
            }
            .custom-select option:checked {
                background-color: #7c3aed !important;
                color: #ffffff !important;
            }
            .custom-select:focus option:checked {
                background-color: #7c3aed !important;
                color: #ffffff !important;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const loadUploadedFiles = async () => {
        try {
            setLoading(true);
            const response = await dataAPI.getHistory();
            setUploadedFiles(response.files || []);
        } catch (error) {
            console.error('Error loading files:', error);
            showToast('Failed to load uploaded files', 'error');
        } finally {
            setLoading(false);
        }
    };

    const loadFileData = async (fileId) => {
        try {
            const response = await dataAPI.getFileData(fileId);
            if (response.success) {
                setFileData(response.data);
                // Auto-select first two columns
                const columns = Object.keys(response.data[0] || {});
                if (columns.length >= 2) {
                    setSelectedColumns({ x: columns[0], y: columns[1] });
                }
            }
        } catch (error) {
            console.error('Error loading file data:', error);
            showToast('Failed to load file data', 'error');
        }
    };

    const handleFileSelect = async (file) => {
        setSelectedFile(file);
        setChartData(null); // Clear previous chart
        setChartTitle(`${file.originalName} - ${selectedChart} Chart`);
        setFileData(null);
        setSelectedColumns({ x: '', y: '' });
        showToast(`Selected file: ${file.originalName}`, 'success');

        // Load file data for column selection
        await loadFileData(file._id);
    };

    const handleGenerateChart = async (isAutoGenerate = false) => {
        if (!selectedFile) {
            if (!isAutoGenerate) {
                showToast('Please select a file first', 'error');
            }
            return;
        }

        if (!selectedColumns.x || !selectedColumns.y) {
            if (!isAutoGenerate) {
                showToast('Please select X and Y columns', 'error');
            }
            return;
        }

        setGenerating(true);
        try {
            if (!isAutoGenerate) {
                showToast('Generating chart...', 'loading');
            }

            const response = await dataAPI.generateChart(selectedFile._id, selectedChart, {
                xColumn: selectedColumns.x,
                yColumn: selectedColumns.y,
                maxRows: maxRows
            });

            setChartData(response.chartConfig);
            setChartTitle(`${selectedFile.originalName} - ${selectedChart} Chart`);

            if (!isAutoGenerate) {
                showToast('Chart generated successfully!', 'success');
            }
        } catch (error) {
            console.error('Error generating chart:', error);
            const errorMessage = error.response?.data?.message || 'Failed to generate chart';
            if (!isAutoGenerate) {
                showToast(errorMessage, 'error');
            }
        } finally {
            setGenerating(false);
        }
    };

    const handleExportChart = async (format = 'png') => {
        if (!chartRef.current) {
            showToast('No chart to export', 'error');
            return;
        }

        try {
            showToast('Exporting chart...', 'loading');

            const canvas = chartRef.current.canvas;
            const link = document.createElement('a');

            if (format === 'png') {
                link.download = `${chartTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
                link.href = canvas.toDataURL('image/png');
            } else if (format === 'jpg') {
                link.download = `${chartTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
                link.href = canvas.toDataURL('image/jpeg', 0.8);
            }

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast(`Chart exported as ${format.toUpperCase()}!`, 'success');
        } catch (error) {
            console.error('Export error:', error);
            showToast('Failed to export chart', 'error');
        }
    };

    const handleShareChart = () => {
        if (!chartData) {
            showToast('No chart to share', 'error');
            return;
        }

        try {
            const shareText = `Check out this ${selectedChart} chart generated from ${selectedFile?.originalName}!`;

            if (navigator.share) {
                navigator.share({
                    title: chartTitle,
                    text: shareText,
                    url: window.location.href
                });
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(shareText);
                showToast('Chart info copied to clipboard!', 'success');
            }
        } catch (error) {
            console.error('Share error:', error);
            showToast('Failed to share chart', 'error');
        }
    };

    const getChartOptions = () => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#ffffff',
                    font: {
                        size: 12
                    }
                }
            },
            title: {
                display: true,
                text: chartTitle,
                color: '#ffffff',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#9333ea',
                borderWidth: 1
            }
        },
        scales: selectedChart !== 'pie' ? {
            x: {
                ticks: {
                    color: '#9ca3af'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            y: {
                ticks: {
                    color: '#9ca3af'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        } : undefined
    });

    const renderChart = () => {
        if (!chartData) return null;

        const chartType = chartTypes.find(type => type.id === selectedChart);
        if (!chartType) return null;

        const ChartComponent = chartType.component;

        return (
            <div className="w-full h-full">
                <ChartComponent
                    ref={chartRef}
                    data={chartData}
                    options={getChartOptions()}
                />
            </div>
        );
    };

    const getColumnType = (columnName) => {
        if (!fileData || fileData.length === 0) return 'text';

        const sampleValues = fileData.slice(0, 10).map(row => row[columnName]);
        const numericCount = sampleValues.filter(val => !isNaN(Number(val)) && val !== null && val !== '').length;

        return numericCount > sampleValues.length * 0.7 ? 'numeric' : 'text';
    };

    const renderColumnSelector = () => {
        if (!fileData || fileData.length === 0) return null;

        const columns = Object.keys(fileData[0] || {});
        const sampleData = fileData.slice(0, 5);

        return (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Data Selection</h3>
                    <button
                        onClick={() => setShowColumnSelector(!showColumnSelector)}
                        className="flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                        {showColumnSelector ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                </div>

                {showColumnSelector && (
                    <div className="space-y-6">
                        {/* Column Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    X-Axis Column (Labels)
                                </label>
                                <select
                                    value={selectedColumns.x}
                                    onChange={(e) => setSelectedColumns(prev => ({ ...prev, x: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-purple-400/50 appearance-none cursor-pointer custom-select"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a855f7' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                                        backgroundPosition: 'right 0.75rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em',
                                        paddingRight: '2.5rem'
                                    }}
                                >
                                    <option value="" className="bg-gray-800 text-gray-300">Select X-axis column...</option>
                                    {columns.map((col) => (
                                        <option key={col} value={col} className="bg-gray-800 text-white hover:bg-purple-600 hover:text-white">
                                            {col} ({getColumnType(col)})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Y-Axis Column (Values)
                                </label>
                                <select
                                    value={selectedColumns.y}
                                    onChange={(e) => setSelectedColumns(prev => ({ ...prev, y: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-purple-400/50 appearance-none cursor-pointer custom-select"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a855f7' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                                        backgroundPosition: 'right 0.75rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em',
                                        paddingRight: '2.5rem'
                                    }}
                                >
                                    <option value="" className="bg-gray-800 text-gray-300">Select Y-axis column...</option>
                                    {columns.map((col) => (
                                        <option key={col} value={col} className="bg-gray-800 text-white hover:bg-purple-600 hover:text-white">
                                            {col} ({getColumnType(col)})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Data Preview */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Data Preview (First 5 rows)
                            </label>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            {columns.map((col) => (
                                                <th key={col} className="px-3 py-2 text-left text-gray-400 font-medium">
                                                    {col}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sampleData.map((row, index) => (
                                            <tr key={index} className="border-b border-white/5">
                                                {columns.map((col) => (
                                                    <td key={col} className="px-3 py-2 text-gray-300">
                                                        {String(row[col] || '').substring(0, 20)}
                                                        {String(row[col] || '').length > 20 ? '...' : ''}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Row Limit */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Maximum Rows to Display
                            </label>
                            <input
                                type="range"
                                min="10"
                                max="1000"
                                step="10"
                                value={maxRows}
                                onChange={(e) => setMaxRows(Number(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>10 rows</span>
                                <span>{maxRows} rows</span>
                                <span>1000 rows</span>
                            </div>
                        </div>

                        {/* Column Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-white/5">
                                <h4 className="text-sm font-medium text-white mb-2">Dataset Info</h4>
                                <div className="space-y-1 text-xs text-gray-400">
                                    <div>Total Rows: {fileData.length}</div>
                                    <div>Total Columns: {columns.length}</div>
                                    <div>Numeric Columns: {columns.filter(col => getColumnType(col) === 'numeric').length}</div>
                                    <div>Text Columns: {columns.filter(col => getColumnType(col) === 'text').length}</div>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5">
                                <h4 className="text-sm font-medium text-white mb-2">Selected Columns</h4>
                                <div className="space-y-1 text-xs text-gray-400">
                                    <div>X-Axis: {selectedColumns.x || 'Not selected'}</div>
                                    <div>Y-Axis: {selectedColumns.y || 'Not selected'}</div>
                                    {selectedColumns.x && selectedColumns.y && (
                                        <div className="text-green-400 mt-2">
                                            <Check className="w-3 h-3 inline mr-1" />
                                            Ready to generate chart
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
        >
            {/* Breadcrumb Navigation */}
            <div className="flex items-center space-x-2 mb-6 text-gray-400">
                <Link to="/" className="flex items-center hover:text-purple-400 transition-colors">
                    <Home className="w-4 h-4 mr-1" />
                    Home
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-purple-400">Generate Charts</span>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Generate Charts</h1>
                <p className="text-gray-400">Create beautiful visualizations from your Excel data</p>
            </div>

            {/* Uploaded Files Section */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-400" />
                    Your Uploaded Files
                </h2>

                {loading ? (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                        <span className="ml-2 text-gray-400">Loading files...</span>
                    </div>
                ) : uploadedFiles.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-400 mb-4">No files uploaded yet</p>
                        <Link
                            to="/features/upload"
                            className="inline-flex items-center px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                        >
                            Upload Your First File
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {uploadedFiles.map((file) => (
                            <div
                                key={file._id}
                                onClick={() => handleFileSelect(file)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${selectedFile?._id === file._id
                                    ? 'bg-purple-500/20 border-purple-500/50'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <FileText className="w-5 h-5 text-purple-400" />
                                    <span className="text-xs text-gray-400">
                                        {new Date(file.uploadedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-white font-medium mb-1 truncate">
                                    {file.originalName}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Data Selection Section */}
            {selectedFile && renderColumnSelector()}

            {/* Chart Generation Section */}
            {selectedFile && selectedColumns.x && selectedColumns.y && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4">Generate Chart</h2>

                    {/* Chart Type Selection */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {chartTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setSelectedChart(type.id)}
                                className={`p-4 rounded-xl flex flex-col items-center transition-all duration-200 ${selectedChart === type.id
                                    ? 'bg-purple-500/20 border-purple-500/50'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    } border`}
                            >
                                <type.icon className="w-6 h-6 mb-2 text-purple-400" />
                                <span className="text-white font-medium">{type.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={() => handleGenerateChart(false)}
                        disabled={generating}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center disabled:opacity-50"
                    >
                        {generating ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Play className="w-5 h-5 mr-2" />
                                Generate {selectedChart.charAt(0).toUpperCase() + selectedChart.slice(1)} Chart
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Chart Display */}
            {chartData && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chart Preview */}
                    <div className="lg:col-span-2">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h3 className="text-lg font-semibold text-white mb-4">Generated Chart</h3>
                            <div className="aspect-[16/9] bg-white/5 rounded-lg p-4">
                                {renderChart()}
                            </div>
                        </div>
                    </div>

                    {/* Chart Settings */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <Settings className="w-5 h-5 mr-2 text-purple-400" />
                                Chart Settings
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Chart Title
                                    </label>
                                    <input
                                        type="text"
                                        value={chartTitle}
                                        onChange={(e) => setChartTitle(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Enter chart title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Data Source
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                                        value={selectedFile?.originalName || ''}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Chart Type
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                                        value={chartTypes.find(t => t.id === selectedChart)?.name || ''}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        X-Axis Column
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                                        value={selectedColumns.x || ''}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Y-Axis Column
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                                        value={selectedColumns.y || ''}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Export Options */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <FileDown className="w-5 h-5 mr-2 text-purple-400" />
                                Export Options
                            </h2>
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleExportChart('png')}
                                    className="w-full px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors duration-200 flex items-center justify-center"
                                >
                                    <Image className="w-5 h-5 mr-2" />
                                    Export as PNG
                                </button>
                                <button
                                    onClick={() => handleExportChart('jpg')}
                                    className="w-full px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors duration-200 flex items-center justify-center"
                                >
                                    <Image className="w-5 h-5 mr-2" />
                                    Export as JPG
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleShareChart}
                                className="flex-1 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors duration-200 flex items-center justify-center"
                            >
                                <Share2 className="w-5 h-5 mr-2" />
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Chart Types Preview */}
            <div className="mt-16">
                <h2 className="text-2xl font-bold text-white mb-6">Available Chart Types</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {chartTypes.map((type) => (
                        <div
                            key={type.id}
                            className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-300"
                        >
                            <type.icon className="w-8 h-8 text-purple-400 mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">{type.name}</h3>
                            <p className="text-gray-400">
                                Perfect for {type.id === 'bar' ? 'comparing values' :
                                    type.id === 'line' ? 'showing trends' :
                                        type.id === 'pie' ? 'showing proportions' :
                                            'showing relationships'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default ChartPage; 