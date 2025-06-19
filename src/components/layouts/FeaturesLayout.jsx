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
            <main className="transition-all duration-300 ml-0">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default FeaturesLayout; 