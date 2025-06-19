import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const History = () => {
    const { user } = useAuth();
    const [files, setFiles] = useState([]);
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await axios.get('/api/data/history', { withCredentials: true });
                setFiles(res.data.files);
                setAnalyses(res.data.analyses);
            } catch (err) {
                setError('Failed to fetch history');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const handleDownload = async (fileId) => {
        try {
            const res = await axios.get(`/api/data/report/${fileId}`, {
                responseType: 'blob',
                withCredentials: true,
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'report.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Failed to download report');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-12">
            <h1 className="text-3xl font-bold mb-6">Analysis History</h1>
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-400 mb-2">{error}</div>}
            <div className="w-full max-w-4xl">
                <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">File Name</th>
                            <th className="px-4 py-2 text-left">Uploaded</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file) => (
                            <tr key={file._id} className="border-b border-gray-700">
                                <td className="px-4 py-2">{file.originalName}</td>
                                <td className="px-4 py-2">{new Date(file.uploadedAt).toLocaleString()}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => handleDownload(file._id)}
                                        className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                                    >
                                        Download Report
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {files.length === 0 && !loading && (
                            <tr>
                                <td colSpan={3} className="text-center py-4 text-gray-400">No uploads yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default History; 