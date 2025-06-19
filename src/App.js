import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Toaster } from './components/ui/toaster';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import Register from './pages/Register';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Profile from './pages/Profile';
import AdminPanel from './pages/Admin/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import PublicRoute from './components/PublicRoute';

// Layout Components
import DashboardLayout from './components/layouts/DashboardLayout';
import AuthLayout from './components/layouts/AuthLayout';
import FeaturesLayout from './components/layouts/FeaturesLayout';

// Feature Pages
import Upload from './pages/features/Upload';
import Charts from './pages/features/Charts';
import History from './pages/features/History';
import AIInsights from './pages/features/AIInsights';

function App() {
    return (
        <Provider store={store}>
            <div className="min-h-screen bg-gray-900 flex flex-col">
                <Navbar />
                <main className="flex-grow pt-16">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/contact" element={<ContactUs />} />
                        <Route path="/pricing" element={<Pricing />} />

                        {/* Auth Routes (Public but protected from logged-in users) */}
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <PublicRoute>
                                    <Register />
                                </PublicRoute>
                            }
                        />

                        {/* Protected Routes */}
                        <Route
                            path="/features/*"
                            element={
                                <ProtectedRoute>
                                    <FeaturesLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route path="upload" element={<Upload />} />
                            <Route path="charts" element={<Charts />} />
                            <Route path="history" element={<History />} />
                            <Route path="ai-insights" element={<AIInsights />} />
                        </Route>

                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminPanel />
                                </AdminRoute>
                            }
                        />

                        {/* Catch all route */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
                <Footer />
            </div>
            <Toaster />
        </Provider>
    );
}

export default App; 