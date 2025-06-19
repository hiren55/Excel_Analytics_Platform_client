import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar when route changes on mobile
    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    }, [location]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-red-50">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-100/20 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-gray-100/20 via-transparent to-transparent" />
            <div className="relative">
                <Navbar toggleSidebar={toggleSidebar} />
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
                <main className="md:pl-64 pt-16">
                    <div className="container mx-auto p-4">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout; 