import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, Upload, BarChart3, History, Brain } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from './ui/dropdown-menu';

const Navbar = () => {
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                                DataViz
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                            Home
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1 focus:outline-none">
                                    <span>Features</span>
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent sideOffset={8} className="min-w-[340px] p-4 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 bg-white shadow-2xl rounded-xl border border-gray-200">
                                <DropdownMenuItem asChild className="flex items-start space-x-3 p-3 rounded-lg hover:bg-purple-50 transition cursor-pointer group">
                                    <Link to="/features/upload" className="flex items-start space-x-3 w-full">
                                        <Upload className="h-7 w-7 text-purple-600 group-hover:text-purple-800 mt-1" />
                                        <div>
                                            <div className="font-semibold text-base text-gray-900 group-hover:text-purple-800">Upload Excel</div>
                                            <div className="text-xs text-gray-500 group-hover:text-purple-700">Upload your Excel files and get instant insights.</div>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="flex items-start space-x-3 p-3 rounded-lg hover:bg-blue-50 transition cursor-pointer group">
                                    <Link to="/features/charts" className="flex items-start space-x-3 w-full">
                                        <BarChart3 className="h-7 w-7 text-blue-600 group-hover:text-blue-800 mt-1" />
                                        <div>
                                            <div className="font-semibold text-base text-gray-900 group-hover:text-blue-800">Generate Charts</div>
                                            <div className="text-xs text-gray-500 group-hover:text-blue-700">Create beautiful, interactive charts from your data.</div>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="flex items-start space-x-3 p-3 rounded-lg hover:bg-green-50 transition cursor-pointer group">
                                    <Link to="/features/history" className="flex items-start space-x-3 w-full">
                                        <History className="h-7 w-7 text-green-600 group-hover:text-green-800 mt-1" />
                                        <div>
                                            <div className="font-semibold text-base text-gray-900 group-hover:text-green-800">Analysis History</div>
                                            <div className="text-xs text-gray-500 group-hover:text-green-700">Track and manage your past analyses.</div>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="flex items-start space-x-3 p-3 rounded-lg hover:bg-pink-50 transition cursor-pointer group">
                                    <Link to="/features/ai-insights" className="flex items-start space-x-3 w-full">
                                        <Brain className="h-7 w-7 text-pink-600 group-hover:text-pink-800 mt-1" />
                                        <div>
                                            <div className="font-semibold text-base text-gray-900 group-hover:text-pink-800">AI Insights</div>
                                            <div className="text-xs text-gray-500 group-hover:text-pink-700">Get smart recommendations powered by AI.</div>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
                            Pricing
                        </Link>
                        <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                            Contact
                        </Link>
                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="text-gray-300 hover:text-white transition-colors">
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={() => setIsProfileOpen(true)}
                                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                                >
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
                                        <User className="h-5 w-5 text-white" />
                                    </div>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-400 hover:text-white focus:outline-none"
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-black/95 backdrop-blur-md border-b border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link
                            to="/"
                            className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <div className="block px-3 py-2">
                            <details className="group">
                                <summary className="text-gray-300 hover:text-white transition-colors cursor-pointer flex items-center justify-between">
                                    <span>Features</span>
                                    <svg className="w-4 h-4 ml-1 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                </summary>
                                <div className="pl-4 mt-2 space-y-2">
                                    <Link to="/features/upload" className="block text-gray-300 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Upload Excel</Link>
                                    <Link to="/features/charts" className="block text-gray-300 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Generate Charts</Link>
                                    <Link to="/features/history" className="block text-gray-300 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Analysis History</Link>
                                    <Link to="/features/ai-insights" className="block text-gray-300 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>AI Insights</Link>
                                </div>
                            </details>
                        </div>
                        <Link
                            to="/pricing"
                            className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Pricing
                        </Link>
                        <Link
                            to="/contact"
                            className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Contact
                        </Link>
                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Admin
                                    </Link>
                                )}
                                <Link
                                    to="/profile"
                                    className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Profile Dropdown */}
            <ProfileDropdown isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </nav>
    );
};

export default Navbar; 