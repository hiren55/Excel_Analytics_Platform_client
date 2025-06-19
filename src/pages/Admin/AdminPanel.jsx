import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    BarChart3,
    FileText,
    Activity,
    Shield,
    Settings,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Download,
    Calendar,
    Database,
    RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({});
    const [analytics, setAnalytics] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [refreshing, setRefreshing] = useState(false);

    // Fetch all data
    const fetchData = async () => {
        try {
            setRefreshing(true);

            // Fetch users
            const usersResponse = await axios.get('/admin/users');
            setUsers(usersResponse.data.data);

            // Fetch stats
            const statsResponse = await axios.get('/admin/stats');
            setStats(statsResponse.data.data);

            // Fetch analytics
            const analyticsResponse = await axios.get('/admin/analytics');
            setAnalytics(analyticsResponse.data.data);

        } catch (error) {
            console.error('Error fetching admin data:', error);
            toast.error('Failed to fetch admin data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchData();
    }, []);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (!refreshing) {
                fetchData();
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [refreshing]);

    const handleUserAction = async (action, userId) => {
        try {
            switch (action) {
                case 'view':
                    toast.success(`Viewing user ${userId}`);
                    break;
                case 'edit':
                    toast.success(`Editing user ${userId}`);
                    break;
                case 'delete':
                    if (window.confirm('Are you sure you want to delete this user?')) {
                        await axios.delete(`/admin/users/${userId}`);
                        setUsers(users.filter(u => u._id !== userId));
                        toast.success('User deleted successfully');
                        fetchData(); // Refresh data
                    }
                    break;
                case 'suspend':
                    await axios.put(`/admin/users/${userId}`, { status: 'suspended' });
                    setUsers(users.map(u =>
                        u._id === userId ? { ...u, status: 'suspended' } : u
                    ));
                    toast.success('User suspended successfully');
                    fetchData(); // Refresh data
                    break;
            }
        } catch (error) {
            console.error('User action error:', error);
            toast.error('Failed to perform action');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const statsCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers || 0,
            change: stats.weeklyStats?.newUsers ? `+${stats.weeklyStats.newUsers} this week` : '+0 this week',
            icon: Users,
            color: 'from-blue-500 to-cyan-500'
        },
        {
            title: 'Active Users',
            value: stats.activeUsers || 0,
            change: `${Math.round(((stats.activeUsers || 0) / (stats.totalUsers || 1)) * 100)}% active`,
            icon: Activity,
            color: 'from-green-500 to-emerald-500'
        },
        {
            title: 'Total Files',
            value: stats.totalFiles || 0,
            change: stats.weeklyStats?.newFiles ? `+${stats.weeklyStats.newFiles} this week` : '+0 this week',
            icon: FileText,
            color: 'from-purple-500 to-pink-500'
        },
        {
            title: 'Storage Used',
            value: stats.totalStorage || '0 GB',
            change: `${stats.totalAnalyses || 0} analyses created`,
            icon: Database,
            color: 'from-orange-500 to-red-500'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-gray-900 border-b border-gray-800 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Admin Dashboard
                            </h1>
                            <p className="text-gray-400 mt-1">Real-time platform monitoring and user management</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={fetchData}
                                disabled={refreshing}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 inline ${refreshing ? 'animate-spin' : ''}`} />
                                {refreshing ? 'Refreshing...' : 'Refresh Data'}
                            </button>
                            <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300">
                                <Download className="w-4 h-4 mr-2 inline" />
                                Export Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Navigation Tabs */}
                <div className="flex space-x-1 bg-gray-900 rounded-lg p-1 mb-8">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                        { id: 'users', label: 'Users', icon: Users },
                        { id: 'analytics', label: 'Analytics', icon: Activity },
                        { id: 'settings', label: 'Settings', icon: Settings }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center px-4 py-2 rounded-md transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                        >
                            <tab.icon className="w-4 h-4 mr-2" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {statsCards.map((stat, index) => (
                                <motion.div
                                    key={stat.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-purple-500 transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-400 text-sm">{stat.title}</p>
                                            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                                            <p className="text-green-400 text-sm mt-1">{stat.change}</p>
                                        </div>
                                        <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                                            <stat.icon className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                                <h3 className="text-xl font-semibold mb-4">Recent Activity (Last 24h)</h3>
                                <div className="space-y-4">
                                    {stats.recentFiles?.length > 0 ? (
                                        stats.recentFiles.map((file, index) => (
                                            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                                <div className="flex-1">
                                                    <p className="text-white">File uploaded: {file.originalName}</p>
                                                    <p className="text-gray-400 text-sm">{file.user?.name || 'Unknown user'}</p>
                                                </div>
                                                <span className="text-gray-500 text-sm">
                                                    {new Date(file.createdAt).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-center py-4">No recent activity</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                                <h3 className="text-xl font-semibold mb-4">Recent Users</h3>
                                <div className="space-y-4">
                                    {stats.recentUsers?.length > 0 ? (
                                        stats.recentUsers.map((user, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                                                <div>
                                                    <p className="text-white">{user.name}</p>
                                                    <p className="text-gray-400 text-sm">{user.email}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' :
                                                            user.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {user.status}
                                                    </span>
                                                    <p className="text-gray-400 text-sm mt-1">
                                                        {new Date(user.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-center py-4">No recent users</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Search and Filter */}
                        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                        </div>

                        {/* Users Table */}
                        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Files</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Storage</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Active</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {filteredUsers.map((user) => (
                                            <tr key={user._id} className="hover:bg-gray-800 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-white">{user.name}</div>
                                                        <div className="text-sm text-gray-400">{user.email}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' :
                                                            user.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {user.role}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {user.filesUploaded || 0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {user.storageUsed || '0 GB'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleUserAction('view', user._id)}
                                                            className="text-blue-400 hover:text-blue-300"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUserAction('edit', user._id)}
                                                            className="text-yellow-400 hover:text-yellow-300"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUserAction('suspend', user._id)}
                                                            className="text-orange-400 hover:text-orange-300"
                                                        >
                                                            <Shield className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUserAction('delete', user._id)}
                                                            className="text-red-400 hover:text-red-300"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                                <h3 className="text-xl font-semibold mb-4">Upload Trends</h3>
                                <div className="space-y-4">
                                    {analytics.fileUploads?.length > 0 ? (
                                        analytics.fileUploads.map((upload, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-white">{upload._id}</p>
                                                    <p className="text-gray-400 text-sm">{upload.count} files</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-white">{`${(upload.totalSize / (1024 * 1024 * 1024)).toFixed(2)} GB`}</p>
                                                    <div className="w-32 h-2 bg-gray-700 rounded-full mt-1">
                                                        <div
                                                            className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                                            style={{ width: `${Math.min((upload.count / 10) * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-center py-4">No upload data available</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                                <h3 className="text-xl font-semibold mb-4">Top Active Users</h3>
                                <div className="space-y-4">
                                    {analytics.topUsers?.length > 0 ? (
                                        analytics.topUsers.map((user) => (
                                            <div key={user._id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                                                <div>
                                                    <p className="text-white">{user.name}</p>
                                                    <p className="text-gray-400 text-sm">{user.totalFiles} files, {user.totalAnalyses} analyses</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' :
                                                            user.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {user.status}
                                                    </span>
                                                    <p className="text-white text-sm mt-1">{user.totalActivity} total activities</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-center py-4">No user data available</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                            <h3 className="text-xl font-semibold mb-6">Admin Settings</h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-medium mb-4">Platform Settings</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-white">Enable user registration</p>
                                                <p className="text-gray-400 text-sm">Allow new users to register</p>
                                            </div>
                                            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg">
                                                Enabled
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-white">File upload limit</p>
                                                <p className="text-gray-400 text-sm">Maximum file size per upload</p>
                                            </div>
                                            <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
                                                <option>10 MB</option>
                                                <option>25 MB</option>
                                                <option>50 MB</option>
                                                <option>100 MB</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-white">Storage limit per user</p>
                                                <p className="text-gray-400 text-sm">Maximum storage per user account</p>
                                            </div>
                                            <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
                                                <option>1 GB</option>
                                                <option>5 GB</option>
                                                <option>10 GB</option>
                                                <option>Unlimited</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-800 pt-6">
                                    <h4 className="text-lg font-medium mb-4">Security Settings</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-white">Two-factor authentication</p>
                                                <p className="text-gray-400 text-sm">Require 2FA for admin accounts</p>
                                            </div>
                                            <button className="bg-gray-700 text-white px-4 py-2 rounded-lg">
                                                Disabled
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-white">Session timeout</p>
                                                <p className="text-gray-400 text-sm">Auto-logout after inactivity</p>
                                            </div>
                                            <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
                                                <option>30 minutes</option>
                                                <option>1 hour</option>
                                                <option>2 hours</option>
                                                <option>Never</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-800 pt-6">
                                    <h4 className="text-lg font-medium mb-4">Backup & Export</h4>
                                    <div className="space-y-4">
                                        <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
                                            <Download className="w-4 h-4 mr-2 inline" />
                                            Export All Data
                                        </button>
                                        <button className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300">
                                            <Calendar className="w-4 h-4 mr-2 inline" />
                                            Schedule Backup
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel; 