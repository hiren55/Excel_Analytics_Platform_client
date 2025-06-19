import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            <div className="absolute inset-0 bg-[url('../public/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 animate-fade-in">
                        Transform Your Data into
                        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                            {" "}Powerful Insights
                        </span>
                    </h1>

                    <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in-up">
                        Unlock the full potential of your data with our advanced analytics platform.
                        Visualize, analyze, and make data-driven decisions with confidence.
                    </p>

                    <div className="mt-10 flex justify-center gap-4 animate-fade-in-up">
                        <Link
                            to="/register"
                            className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
                        >
                            Get Started Free
                        </Link>
                        <Link
                            to="/features"
                            className="px-8 py-3 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-all duration-200"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>

                {/* Feature Highlights */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-purple-500/50 transition-all duration-200">
                        <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Advanced Analytics</h3>
                        <p className="text-gray-400">Powerful tools to analyze and visualize your data in real-time.</p>
                    </div>

                    <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-purple-500/50 transition-all duration-200">
                        <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Real-time Insights</h3>
                        <p className="text-gray-400">Get instant insights and make data-driven decisions faster.</p>
                    </div>

                    <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-purple-500/50 transition-all duration-200">
                        <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Secure & Reliable</h3>
                        <p className="text-gray-400">Enterprise-grade security to keep your data safe and protected.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero; 