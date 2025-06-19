import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
    Brain,
    FileText,
    Sparkles,
    TrendingUp,
    AlertTriangle,
    Lightbulb,
    Download,
    Share2,
    ChevronRight,
    Home,
    Loader2,
    RefreshCw,
    FileDown,
    ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/use-toast';
import { dataAPI } from '../../services/api';

const AIInsightsPage = () => {
    const [selectedFile, setSelectedFile] = useState('');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingFiles, setLoadingFiles] = useState(true);
    const [insights, setInsights] = useState(null);
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const { user } = useAuth();
    const { showToast } = useToast();
    const location = useLocation();

    useEffect(() => {
        loadFiles();

        // Check if a file was passed from History page
        if (location.state?.selectedFile) {
            setSelectedFile(location.state.selectedFile._id);
        }
    }, [location.state]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showExportDropdown && !event.target.closest('.export-dropdown')) {
                setShowExportDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showExportDropdown]);

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

    const loadFiles = async () => {
        try {
            setLoadingFiles(true);
            const response = await dataAPI.getHistory();
            setFiles(response.files || []);
        } catch (error) {
            console.error('Error loading files:', error);
            showToast('Failed to load files', 'error');
        } finally {
            setLoadingFiles(false);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile) {
            showToast('Please select a file to analyze', 'error');
            return;
        }

        setLoading(true);
        setInsights(null);

        try {
            showToast('Analyzing data with AI...', 'loading');
            const response = await dataAPI.getInsights(selectedFile);

            if (response.success) {
                setInsights(response.data);
                showToast('Analysis completed successfully!', 'success');
            } else {
                throw new Error(response.message || 'Analysis failed');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            showToast(error.message || 'Failed to analyze data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleExportReport = async (format = 'json') => {
        if (!insights) return;

        try {
            showToast(`Exporting ${format.toUpperCase()} report...`, 'loading');

            if (format === 'json') {
                // Export as JSON
                const report = {
                    timestamp: new Date().toISOString(),
                    file: files.find(f => f._id === selectedFile)?.originalName || 'Unknown File',
                    insights: insights
                };

                const blob = new Blob([JSON.stringify(report, null, 2)], {
                    type: 'application/json'
                });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `ai_insights_${Date.now()}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else if (format === 'pdf') {
                // Export as PDF
                await exportAsPDF();
            }

            showToast(`${format.toUpperCase()} report exported successfully!`, 'success');
        } catch (error) {
            console.error('Export error:', error);
            showToast(`Failed to export ${format.toUpperCase()} report`, 'error');
        }
    };

    const exportAsPDF = async () => {
        try {
            // Dynamic import for PDF libraries
            const jsPDF = (await import('jspdf')).default;
            const html2canvas = (await import('html2canvas')).default;

            // Create a temporary container for PDF content
            const pdfContainer = document.createElement('div');
            pdfContainer.style.position = 'absolute';
            pdfContainer.style.left = '-9999px';
            pdfContainer.style.top = '0';
            pdfContainer.style.width = '800px';
            pdfContainer.style.backgroundColor = '#ffffff';
            pdfContainer.style.color = '#000000';
            pdfContainer.style.padding = '40px';
            pdfContainer.style.fontFamily = 'Arial, sans-serif';

            // Create PDF content
            const fileName = files.find(f => f._id === selectedFile)?.originalName || 'Unknown File';
            const timestamp = new Date().toLocaleString();

            pdfContainer.innerHTML = `
                <div style="margin-bottom: 30px;">
                    <h1 style="color: #7c3aed; font-size: 28px; margin-bottom: 10px;">AI-Powered Insights Report</h1>
                    <p style="color: #666; font-size: 14px; margin-bottom: 5px;"><strong>File:</strong> ${fileName}</p>
                    <p style="color: #666; font-size: 14px; margin-bottom: 5px;"><strong>Generated:</strong> ${timestamp}</p>
                </div>

                ${insights.summary ? `
                    <div style="margin-bottom: 25px;">
                        <h2 style="color: #7c3aed; font-size: 20px; margin-bottom: 10px;">📊 AI Summary</h2>
                        <p style="color: #333; font-size: 14px; line-height: 1.6;">${insights.summary}</p>
                    </div>
                ` : ''}

                ${insights.trends && insights.trends.length > 0 ? `
                    <div style="margin-bottom: 25px;">
                        <h2 style="color: #7c3aed; font-size: 20px; margin-bottom: 10px;">📈 Key Trends</h2>
                        <ul style="color: #333; font-size: 14px; line-height: 1.6; padding-left: 20px;">
                            ${insights.trends.map(trend => `<li style="margin-bottom: 5px;">${trend}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${insights.recommendations && insights.recommendations.length > 0 ? `
                    <div style="margin-bottom: 25px;">
                        <h2 style="color: #7c3aed; font-size: 20px; margin-bottom: 10px;">💡 Recommendations</h2>
                        <ul style="color: #333; font-size: 14px; line-height: 1.6; padding-left: 20px;">
                            ${insights.recommendations.map(rec => `<li style="margin-bottom: 5px;">${rec}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${insights.anomalies && insights.anomalies.length > 0 ? `
                    <div style="margin-bottom: 25px;">
                        <h2 style="color: #f59e0b; font-size: 20px; margin-bottom: 10px;">⚠️ Anomalies Detected</h2>
                        <ul style="color: #333; font-size: 14px; line-height: 1.6; padding-left: 20px;">
                            ${insights.anomalies.map(anomaly => `<li style="margin-bottom: 5px;">${anomaly}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${insights.dataQuality && insights.dataQuality.length > 0 ? `
                    <div style="margin-bottom: 25px;">
                        <h2 style="color: #3b82f6; font-size: 20px; margin-bottom: 10px;">📋 Data Quality Observations</h2>
                        <ul style="color: #333; font-size: 14px; line-height: 1.6; padding-left: 20px;">
                            ${insights.dataQuality.map(observation => `<li style="margin-bottom: 5px;">${observation}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${insights.statistics ? `
                    <div style="margin-bottom: 25px;">
                        <h2 style="color: #7c3aed; font-size: 20px; margin-bottom: 10px;">📊 Statistical Summary</h2>
                        <div style="color: #333; font-size: 12px; line-height: 1.4;">
                            ${Object.entries(insights.statistics).map(([key, stats]) => `
                                <div style="margin-bottom: 10px; padding: 10px; background-color: #f8f9fa; border-radius: 5px;">
                                    <strong>${key}:</strong><br>
                                    Count: ${stats.count} | Min: ${stats.min} | Max: ${stats.max} | Mean: ${stats.mean} | Total: ${stats.total}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
                    <p>Generated by AI-Powered Analytics Platform</p>
                    <p>For more insights, visit our platform</p>
                </div>
            `;

            // Add to document temporarily
            document.body.appendChild(pdfContainer);

            // Convert to canvas
            const canvas = await html2canvas(pdfContainer, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
            });

            // Remove temporary container
            document.body.removeChild(pdfContainer);

            // Create PDF
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // Download PDF
            const cleanFileName = fileName.replace(/\.(xlsx|xls|csv)$/, '');
            pdf.save(`ai_insights_${cleanFileName}_${Date.now()}.pdf`);

        } catch (error) {
            console.error('PDF export error:', error);
            throw new Error('Failed to generate PDF. Please try again.');
        }
    };

    const handleShareInsights = () => {
        if (!insights) return;

        try {
            const shareText = `AI Insights for ${files.find(f => f._id === selectedFile)?.originalName}:\n\n` +
                `Summary: ${insights.summary}\n\n` +
                `Key Trends:\n${insights.trends?.map(t => `• ${t}`).join('\n')}\n\n` +
                `Recommendations:\n${insights.recommendations?.map(r => `• ${r}`).join('\n')}`;

            if (navigator.share) {
                navigator.share({
                    title: 'AI Insights Report',
                    text: shareText
                });
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(shareText);
                showToast('Insights copied to clipboard!', 'success');
            }
        } catch (error) {
            console.error('Share error:', error);
            showToast('Failed to share insights', 'error');
        }
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
                <span className="text-purple-400">AI Insights</span>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">AI-Powered Insights</h1>
                <p className="text-gray-400">Get intelligent analysis and recommendations from your data</p>
            </div>

            {/* File Selection */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Select Excel File
                        </label>
                        {loadingFiles ? (
                            <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                                <span className="text-gray-400">Loading files...</span>
                            </div>
                        ) : (
                            <select
                                value={selectedFile}
                                onChange={(e) => setSelectedFile(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-purple-400/50 appearance-none cursor-pointer custom-select"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a855f7' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: 'right 0.75rem center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: '1.5em 1.5em',
                                    paddingRight: '2.5rem'
                                }}
                            >
                                <option value="" className="bg-gray-800 text-gray-300">Choose a file...</option>
                                {files.map((file) => (
                                    <option
                                        key={file._id}
                                        value={file._id}
                                        className="bg-gray-800 text-white hover:bg-purple-600 hover:text-white"
                                    >
                                        {file.originalName} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <button
                        onClick={loadFiles}
                        disabled={loadingFiles}
                        className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors duration-200 disabled:opacity-50"
                        title="Refresh files"
                    >
                        <RefreshCw className={`w-5 h-5 ${loadingFiles ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={handleAnalyze}
                        disabled={!selectedFile || loading}
                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {loading ? (
                            <>
                                <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Brain className="w-5 h-5 mr-2" />
                                Analyze Data
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Insights Display */}
            {insights && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Summary */}
                    {insights.summary && (
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                                AI Summary
                            </h2>
                            <p className="text-gray-300 leading-relaxed">
                                {insights.summary}
                            </p>
                        </div>
                    )}

                    {/* Trends */}
                    {insights.trends && insights.trends.length > 0 && (
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
                                Key Trends
                            </h2>
                            <ul className="space-y-3">
                                {insights.trends.map((trend, index) => (
                                    <li key={index} className="flex items-start text-gray-300">
                                        <span className="w-2 h-2 rounded-full bg-purple-400 mt-2 mr-3" />
                                        {trend}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Recommendations */}
                    {insights.recommendations && insights.recommendations.length > 0 && (
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <Lightbulb className="w-5 h-5 mr-2 text-purple-400" />
                                Recommendations
                            </h2>
                            <ul className="space-y-3">
                                {insights.recommendations.map((rec, index) => (
                                    <li key={index} className="flex items-start text-gray-300">
                                        <span className="w-2 h-2 rounded-full bg-purple-400 mt-2 mr-3" />
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Anomalies */}
                    {insights.anomalies && insights.anomalies.length > 0 && (
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                                Anomalies Detected
                            </h2>
                            <ul className="space-y-3">
                                {insights.anomalies.map((anomaly, index) => (
                                    <li key={index} className="flex items-start text-gray-300">
                                        <span className="w-2 h-2 rounded-full bg-yellow-400 mt-2 mr-3" />
                                        {anomaly}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Data Quality */}
                    {insights.dataQuality && insights.dataQuality.length > 0 && (
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-blue-400" />
                                Data Quality Observations
                            </h2>
                            <ul className="space-y-3">
                                {insights.dataQuality.map((observation, index) => (
                                    <li key={index} className="flex items-start text-gray-300">
                                        <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 mr-3" />
                                        {observation}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4">
                        {/* Export Dropdown */}
                        <div className="relative flex-1 export-dropdown">
                            <button
                                onClick={() => setShowExportDropdown(!showExportDropdown)}
                                className="w-full px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors duration-200 flex items-center justify-center"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Export Report
                                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showExportDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {showExportDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-white/20 rounded-lg shadow-lg z-10"
                                >
                                    <button
                                        onClick={() => {
                                            handleExportReport('json');
                                            setShowExportDropdown(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-white hover:bg-purple-500/20 transition-colors flex items-center"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Export as JSON
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleExportReport('pdf');
                                            setShowExportDropdown(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-white hover:bg-blue-500/20 transition-colors flex items-center"
                                    >
                                        <FileDown className="w-4 h-4 mr-2" />
                                        Export as PDF
                                    </button>
                                </motion.div>
                            )}
                        </div>

                        <button
                            onClick={handleShareInsights}
                            className="flex-1 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors duration-200 flex items-center justify-center"
                        >
                            <Share2 className="w-5 h-5 mr-2" />
                            Share Insights
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Empty State */}
            {!loading && !insights && files.length === 0 && !loadingFiles && (
                <div className="text-center py-12">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-white mb-2">No files available</h3>
                    <p className="text-gray-400 mb-6">
                        Upload an Excel file first to get AI-powered insights
                    </p>
                    <Link
                        to="/features/upload"
                        className="inline-flex items-center px-6 py-3 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                    >
                        <FileText className="w-5 h-5 mr-2" />
                        Upload Your First File
                    </Link>
                </div>
            )}

            {/* Features Preview */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-2">Pattern Recognition</h3>
                    <p className="text-gray-400">AI identifies hidden patterns and correlations in your data</p>
                </div>
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-2">Predictive Analytics</h3>
                    <p className="text-gray-400">Get forecasts and predictions based on historical data</p>
                </div>
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-2">Smart Recommendations</h3>
                    <p className="text-gray-400">Receive actionable insights to improve your business</p>
                </div>
            </div>
        </motion.div>
    );
};

export default AIInsightsPage; 