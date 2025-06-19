import axios from 'axios';

// Get the API URL from environment variables or us e a default value
const API_URL = 'https://excel-analytics-platform-server-pppz.onrender.com/api';
// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for authentication
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData).then(res => res.data),
    login: (credentials) => api.post('/auth/login', credentials).then(res => res.data),
    getProfile: () => api.get('/auth/profile').then(res => res.data),
    updateProfile: (profileData) => api.put('/auth/profile', profileData).then(res => res.data),
    changePassword: (passwordData) => api.put('/auth/password', passwordData).then(res => res.data)
};

// Excel API
export const excelAPI = {
    upload: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/excel/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => res.data);
    },
    getAll: () => api.get('/excel').then(res => res.data),
    getById: (id) => api.get(`/excel/${id}`).then(res => res.data),
    delete: (id) => api.delete(`/excel/${id}`).then(res => res.data)
};

// Data API (for file upload and processing)
export const dataAPI = {
    upload: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/data/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => res.data);
    },
    getFileData: (fileId) => api.get(`/data/file/${fileId}`).then(res => res.data),
    generateChart: (fileId, chartType = 'bar', options = {}) => api.post(`/data/generate-chart`, {
        fileId,
        chartType,
        xColumn: options.xColumn,
        yColumn: options.yColumn,
        maxRows: options.maxRows
    }).then(res => res.data),
    getChart: (chartId) => api.get(`/data/chart/${chartId}`).then(res => res.data),
    getHistory: () => api.get('/data/history').then(res => res.data),
    getInsights: (fileId) => api.get(`/data/insights/${fileId}`).then(res => res.data),
    downloadReport: (reportId) => api.get(`/data/download/${reportId}`, {
        responseType: 'blob'
    }).then(res => res),
    deleteFile: (fileId) => api.delete(`/data/file/${fileId}`).then(res => res.data)
};

// Analysis API
export const analysisAPI = {
    create: (data) => api.post('/analysis', data).then(res => res.data),
    getAll: () => api.get('/analysis').then(res => res.data),
    getById: (id) => api.get(`/analysis/${id}`).then(res => res.data),
    update: (id, data) => api.put(`/analysis/${id}`, data).then(res => res.data),
    delete: (id) => api.delete(`/analysis/${id}`).then(res => res.data),
    generateChart: (id, config) => api.post(`/analysis/${id}/chart`, config).then(res => res.data),
    generateInsights: (id) => api.post(`/analysis/${id}/insights`).then(res => res.data)
};

// History API
export const historyAPI = {
    getAll: () => api.get('/history').then(res => res.data),
    getByResource: (resourceType, resourceId) =>
        api.get(`/history/${resourceType}/${resourceId}`).then(res => res.data)
};

export default api;