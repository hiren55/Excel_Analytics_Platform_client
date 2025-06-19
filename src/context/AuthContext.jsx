import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Configure axios defaults
    const apiBaseUrl = 'https://excel-analytics-platform-server-pppz.onrender.com/api';
    axios.defaults.baseURL = apiBaseUrl;
    axios.defaults.withCredentials = true;

    // Add request interceptor for token
    axios.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Add response interceptor for token expiration
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                setUser(null);
                setIsAuthenticated(false);
                toast.error('Session expired. Please login again.');
            }
            return Promise.reject(error);
        }
    );

    // Check authentication status on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setUser(null);
                    setIsAuthenticated(false);
                    setLoading(false);
                    return;
                }

                const response = await axios.get('/auth/profile');
                if (response.data.data) {
                    setUser(response.data.data);
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('token');
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('token');
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Register new user
    const register = async (userData) => {
        try {
            const response = await axios.post('/auth/register', userData);
            const { token, user } = response.data.data;

            localStorage.setItem('token', token);
            setUser(user);
            setIsAuthenticated(true);

            toast.success('Registration successful! Welcome aboard! 🎉');
            return { success: true, user };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    // Login user
    const login = async (credentials) => {
        try {
            const response = await axios.post('/auth/login', credentials);
            const { token, user } = response.data.data;

            localStorage.setItem('token', token);
            setUser(user);
            setIsAuthenticated(true);

            toast.success('Login successful! Welcome back! 👋');
            return { success: true, user };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    // Logout user
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        toast.success('Logged out successfully. See you soon! 👋');
        return { success: true };
    };

    // Update user profile
    const updateProfile = async (userData) => {
        try {
            const response = await axios.put('/auth/profile', userData);
            setUser(response.data.data);
            toast.success('Profile updated successfully! ✨');
            return { success: true, user: response.data.data };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update profile. Please try again.';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    // Change password
    const changePassword = async (passwordData) => {
        try {
            await axios.put('/auth/change-password', passwordData);
            toast.success('Password changed successfully! 🔒');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to change password. Please try again.';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        register,
        login,
        logout,
        updateProfile,
        changePassword
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}; 