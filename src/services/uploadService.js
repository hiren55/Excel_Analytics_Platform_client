import api from './api';

export const uploadExcel = (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
});

export const getUploads = () => api.get('/upload/history'); 