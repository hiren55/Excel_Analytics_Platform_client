import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart2, Upload, History } from 'lucide-react';

const Home = () => {
    const { user, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Auth State:', { user, isAuthenticated, loading });
    }, [user, isAuthenticated, loading]);

    const handleGetStarted = () => {
        console.log('Get Started clicked. Auth State:', { user, isAuthenticated, loading });
        if (isAuthenticated && user) {
            navigate('/features/upload');
        } else {
            navigate('/register');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"
                        >
                            Transform Your Data into Insights
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
                        >
                            Upload your Excel files, generate beautiful charts, and get instant insights with our powerful data visualization platform.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <button
                                onClick={handleGetStarted}
                                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity flex items-center mx-auto"
                            >
                                {isAuthenticated && user ? 'Go to Dashboard' : 'Get Started Free'}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Key Features</h2>
                        <p className="text-gray-300">Everything you need to visualize and analyze your data</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-gray-700 p-6 rounded-lg"
                        >
                            <Upload className="h-12 w-12 text-purple-400 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Easy Upload</h3>
                            <p className="text-gray-300">Upload your Excel files with a simple drag and drop interface</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-gray-700 p-6 rounded-lg"
                        >
                            <BarChart2 className="h-12 w-12 text-purple-400 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Smart Charts</h3>
                            <p className="text-gray-300">Generate beautiful and interactive charts automatically</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="bg-gray-700 p-6 rounded-lg"
                        >
                            <History className="h-12 w-12 text-purple-400 mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">History Tracking</h3>
                            <p className="text-gray-300">Keep track of all your previous analyses and charts</p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
                    <p className="text-gray-300 mb-8">Join thousands of users who are already visualizing their data with us</p>
                    <button
                        onClick={handleGetStarted}
                        className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        {isAuthenticated && user ? 'Go to Dashboard' : 'Get Started Free'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home; 