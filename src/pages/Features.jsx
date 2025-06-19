import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    BarChart3,
    Brain,
    FileText,
    History,
    LineChart,
    PieChart,
    Settings,
    Upload,
    Zap,
    FileSpreadsheet,
    ArrowRight,
} from 'lucide-react';
import { useToast } from '../components/ui/use-toast';

const Features = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { user } = useAuth();
    const [isDragging, setIsDragging] = useState(false);

    const features = [
        {
            title: 'Upload Excel',
            description: 'Upload your Excel files and get instant insights',
            icon: FileSpreadsheet,
            path: '/features/upload',
            benefits: [
                'Support for .xlsx and .csv files',
                'Drag and drop interface',
                'Automatic data validation',
                'Real-time processing'
            ]
        },
        {
            title: 'Generate Charts',
            description: 'Create beautiful, interactive charts from your data',
            icon: BarChart3,
            path: '/features/charts',
            benefits: [
                'Multiple chart types',
                'Customizable themes',
                'Export to PNG/PDF',
                'Interactive tooltips'
            ]
        },
        {
            title: 'Analysis History',
            description: 'Track and manage your past analyses',
            icon: History,
            path: '/features/history',
            benefits: [
                'Complete analysis history',
                'Quick access to past charts',
                'Data comparison tools',
                'Export history reports'
            ]
        },
        {
            title: 'AI Insights',
            description: 'Get intelligent insights from your data',
            icon: Brain,
            path: '/features/ai-insights',
            benefits: [
                'Pattern recognition',
                'Trend analysis',
                'Predictive analytics',
                'Smart recommendations'
            ]
        }
    ];

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (!user) {
            showToast('Please login to upload files', 'error');
            navigate('/login');
            return;
        }
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.type === 'text/csv') {
                navigate('/features/upload', { state: { file } });
            } else {
                showToast('Please upload an Excel (.xlsx) or CSV file', 'error');
            }
        }
    };

    const handleFeatureClick = (path) => {
        if (!user) {
            showToast('Please login to access this feature', 'error');
            navigate('/login');
            return;
        }
        navigate(path);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                                Modern Analytics
                            </span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Transform your data into actionable insights with our powerful analytics platform
                        </p>
                        {user && (
                            <div
                                className={`max-w-xl mx-auto p-8 border-2 border-dashed rounded-lg transition-colors ${isDragging ? 'border-purple-500 bg-purple-900/20' : 'border-gray-600'}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <div className="text-center">
                                    <Upload className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                                    <p className="text-lg mb-2">Drag and drop your Excel file here</p>
                                    <p className="text-sm text-gray-400">or click to browse</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors cursor-pointer"
                                onClick={() => handleFeatureClick(feature.path)}
                            >
                                <feature.icon className="w-12 h-12 text-purple-400 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-300 mb-4">{feature.description}</p>
                                <ul className="space-y-2">
                                    {feature.benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-center text-sm text-gray-300">
                                            <ArrowRight className="w-4 h-4 mr-2 text-purple-400" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                            Join thousands of users who are already transforming their data into valuable insights
                        </p>
                        <button
                            onClick={() => handleFeatureClick('/features/upload')}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                        >
                            {user ? 'Start Analyzing Now' : 'Sign Up to Get Started'}
                        </button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Features; 