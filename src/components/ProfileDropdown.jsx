import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Settings, LogOut } from 'lucide-react';

const ProfileDropdown = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50" onClick={onClose}>
            <div className="absolute right-4 top-16 w-72 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">{user?.name}</h3>
                            <p className="text-sm text-gray-400">{user?.email}</p>
                        </div>
                    </div>
                </div>
                <div className="py-2">
                    <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 transition-colors"
                        onClick={onClose}
                    >
                        <User className="h-5 w-5 mr-3 text-purple-400" />
                        <span>Your Profile</span>
                    </Link>
                    <Link
                        to="/settings"
                        className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 transition-colors"
                        onClick={onClose}
                    >
                        <Settings className="h-5 w-5 mr-3 text-purple-400" />
                        <span>Settings</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                        <LogOut className="h-5 w-5 mr-3 text-purple-400" />
                        <span>Sign out</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileDropdown; 