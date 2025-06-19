import api from './api';

export const generateChart = (data) => api.post('/charts/generate', data);
export const downloadChart = (id, format) => api.get(`/charts/${id}/download?format=${format}`); 