import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    History,
    FileText,
    BarChart3,
    Calendar,
    Search,
    Filter,
    Download,
    Trash2,
    ChevronRight,
    Home,
    Loader2,
    Eye,
    Brain,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/use-toast';
import { dataAPI } from '../../services/api';

const HistoryPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [files, setFiles] = useState([]);
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            setLoading(true);
            const response = await dataAPI.getHistory();
            setFiles(response.files || []);
            setAnalyses(response.analyses || []);
        } catch (error) {
            console.error('Error loading history:', error);
            showToast('Failed to load history', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (fileId, fileName) => {
        try {
            showToast('Downloading report...', 'loading');
            const response = await dataAPI.downloadReport(fileId);

            // Create download link
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            // Get filename from response headers or create a clean one
            const contentDisposition = response.headers?.['content-disposition'];
            let downloadFileName;

            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch) {
                    downloadFileName = filenameMatch[1];
                }
            }

            if (!downloadFileName) {
                // Fallback: create clean filename
                let cleanFileName = fileName;
                if (cleanFileName.endsWith('.xlsx') || cleanFileName.endsWith('.xls')) {
                    cleanFileName = cleanFileName.replace(/\.(xlsx|xls)$/, '');
                }
                downloadFileName = `${cleanFileName}_report.xlsx`;
            }

            link.download = downloadFileName;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            showToast('Report downloaded successfully!', 'success');
        } catch (error) {
            console.error('Download error:', error);
            showToast('Failed to download report', 'error');
        }
    };

    const handleDelete = async (fileId, fileName) => {
        if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
            return;
        }

        try {
            showToast('Deleting file...', 'loading');
            await dataAPI.deleteFile(fileId);
            showToast('File deleted successfully!', 'success');
            loadHistory(); // Reload the list
        } catch (error) {
            console.error('Delete error:', error);
            showToast('Failed to delete file', 'error');
        }
    };

    // Combine files and analyses for display
    const allItems = [
        ...files.map(file => ({
            id: file._id,
            title: file.originalName,
            type: 'file',
            date: file.uploadedAt,
            file: file.originalName,
            icon: FileText,
            size: file.size,
            data: file
        })),
        ...analyses.map(analysis => ({
            id: analysis._id,
            title: analysis.name || 'Generated Analysis',
            type: 'analysis',
            date: analysis.createdAt,
            file: analysis.file?.originalName || 'Unknown File',
            icon: BarChart3,
            data: analysis
        }))
    ];

    const filteredItems = allItems.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.file.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter;
        return matchesSearch && matchesFilter;
    });

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
                <span className="text-purple-400">Analysis History</span>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Analysis History</h1>
                <p className="text-gray-400">View and manage your past analyses and visualizations</p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search files and analyses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setSelectedFilter('all')}
                        className={`px-4 py-2 rounded-lg flex items-center ${selectedFilter === 'all'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <Filter className="w-5 h-5 mr-2" />
                        All
                    </button>
                    <button
                        onClick={() => setSelectedFilter('file')}
                        className={`px-4 py-2 rounded-lg flex items-center ${selectedFilter === 'file'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <FileText className="w-5 h-5 mr-2" />
                        Files
                    </button>
                    <button
                        onClick={() => setSelectedFilter('analysis')}
                        className={`px-4 py-2 rounded-lg flex items-center ${selectedFilter === 'analysis'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Analyses
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                    <span className="ml-3 text-gray-400">Loading history...</span>
                </div>
            )}

            {/* Items List */}
            {!loading && (
                <div className="space-y-4">
                    {filteredItems.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 rounded-lg bg-purple-500/20">
                                        <item.icon className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white mb-1">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center text-sm text-gray-400 space-x-4">
                                            <span className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {new Date(item.date).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center">
                                                <FileText className="w-4 h-4 mr-1" />
                                                {item.file}
                                            </span>
                                            {item.size && (
                                                <span className="text-gray-500">
                                                    {(item.size / 1024 / 1024).toFixed(2)} MB
                                                </span>
                                            )}
                                            <span className={`px-2 py-1 rounded-full text-xs ${item.type === 'file'
                                                ? 'bg-blue-500/20 text-blue-400'
                                                : 'bg-green-500/20 text-green-400'
                                                }`}>
                                                {item.type === 'file' ? 'File' : 'Analysis'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {item.type === 'file' && (
                                        <>
                                            <Link
                                                to={`/features/charts`}
                                                state={{ selectedFile: item.data }}
                                                className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-purple-400 transition-colors duration-200"
                                                title="Generate Chart"
                                            >
                                                <BarChart3 className="w-5 h-5" />
                                            </Link>
                                            <Link
                                                to={`/features/ai-insights`}
                                                state={{ selectedFile: item.data }}
                                                className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-blue-400 transition-colors duration-200"
                                                title="View Insights"
                                            >
                                                <Brain className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDownload(item.id, item.title)}
                                                className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-green-400 transition-colors duration-200"
                                                title="Download Report"
                                            >
                                                <Download className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                    {item.type === 'analysis' && (
                                        <button
                                            onClick={() => handleDownload(item.id, item.title)}
                                            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-green-400 transition-colors duration-200"
                                            title="Download Analysis"
                                        >
                                            <Download className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(item.id, item.title)}
                                        className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-red-400 transition-colors duration-200"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredItems.length === 0 && (
                <div className="text-center py-12">
                    <History className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                        {searchQuery ? 'No items found' : 'No history yet'}
                    </h3>
                    <p className="text-gray-400 mb-6">
                        {searchQuery
                            ? 'Try adjusting your search or filter criteria'
                            : 'Start by uploading an Excel file and creating your first analysis'}
                    </p>
                    {!searchQuery && (
                        <Link
                            to="/features/upload"
                            className="inline-flex items-center px-6 py-3 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                        >
                            <FileText className="w-5 h-5 mr-2" />
                            Upload Your First File
                        </Link>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default HistoryPage; 