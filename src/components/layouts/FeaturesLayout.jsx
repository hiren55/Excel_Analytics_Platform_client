import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    BarChart3,
    Brain,
    FileText,
    History,
    Upload,
    Menu,
    X,
} from 'lucide-react';

const navItems = [
    { path: '/features/upload', icon: Upload, label: 'Upload Excel' },
    { path: '/features/charts', icon: BarChart3, label: 'Generate Charts' },
    { path: '/features/history', icon: History, label: 'Analysis History' },
    { path: '/features/ai-insights', icon: Brain, label: 'AI Insights' },
];

const FeaturesLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
            {/* Sidebar */}
            <motion.aside
                initial={{ width: 0 }}
                animate={{ width: isSidebarOpen ? 280 : 0 }}
                className="fixed left-0 top-0 z-40 h-screen overflow-hidden bg-white/5 backdrop-blur-lg border-r border-white/10 transition-all duration-300"
            >
                <div className="flex h-full flex-col">
                    {/* Logo and Toggle */}
                    <div className="flex h-16 items-center justify-between px-4">
                        <h1 className="text-xl font-bold glow-text">Excel Analytics</h1>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="rounded-lg p-2 hover:bg-white/10"
                        >
                            <X className="h-5 w-5 text-white" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
                                        ? 'bg-purple-500/20 text-purple-400'
                                        : 'text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </motion.aside>

            {/* Mobile Menu Button */}
            {!isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors duration-200"
                >
                    <Menu className="w-6 h-6" />
                </button>
            )}

            {/* Main Content */}
            <main
                className={`transition-all duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-0'}`}
            >
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default FeaturesLayout; 