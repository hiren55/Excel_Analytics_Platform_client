import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Insights = () => {
    const { user } = useAuth();
    const [files, setFiles] = useState([]);
    const [selected, setSelected] = useState(null);
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const res = await axios.get('/api/data/history', { withCredentials: true });
                setFiles(res.data.files);
            } catch (err) {
                setError('Failed to fetch files');
            }
        };
        fetchFiles();
    }, []);

    useEffect(() => {
        if (!selected) return;
        const fetchInsights = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await axios.get(`/api/data/insights/${selected}`, { withCredentials: true });
                setInsights(res.data);
            } catch (err) {
                setError('Failed to fetch insights');
                setInsights(null);
            } finally {
                setLoading(false);
            }
        };
        fetchInsights();
    }, [selected]);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-12">
            <h1 className="text-3xl font-bold mb-6">AI Insights</h1>
            {error && <div className="text-red-400 mb-2">{error}</div>}
            <div className="flex flex-wrap gap-4 mb-8">
                {files.map((file) => (
                    <button
                        key={file._id}
                        onClick={() => setSelected(file._id)}
                        className={`px-4 py-2 rounded-lg border ${selected === file._id ? 'bg-purple-700 border-purple-400' : 'bg-gray-800 border-gray-700'} font-semibold`}
                    >
                        {file.originalName}
                    </button>
                ))}
            </div>
            {loading && <div>Loading insights...</div>}
            {insights && (
                <div className="w-full max-w-3xl bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Summary</h2>
                    <pre className="bg-gray-900 rounded p-2 mb-4 overflow-x-auto text-sm">
                        {JSON.stringify(insights.summary, null, 2)}
                    </pre>
                    <h2 className="text-xl font-semibold mb-4">Trends</h2>
                    <pre className="bg-gray-900 rounded p-2 mb-4 overflow-x-auto text-sm">
                        {JSON.stringify(insights.trends, null, 2)}
                    </pre>
                    <h2 className="text-xl font-semibold mb-4">Outliers</h2>
                    <pre className="bg-gray-900 rounded p-2 overflow-x-auto text-sm">
                        {JSON.stringify(insights.outliers, null, 2)}
                    </pre>
                </div>
            )}
            {!insights && !loading && <div>Select a file to view insights.</div>}
        </div>
    );
};

export default Insights; 