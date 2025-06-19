import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Bar } from 'react-chartjs-2';

const Charts = () => {
    const { user } = useAuth();
    const [files, setFiles] = useState([]);
    const [analyses, setAnalyses] = useState([]);
    const [selected, setSelected] = useState(null);
    const [chartConfig, setChartConfig] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch history (files and analyses)
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('/api/data/history', { withCredentials: true });
                setFiles(res.data.files);
                setAnalyses(res.data.analyses);
            } catch (err) {
                setError('Failed to fetch history');
            }
        };
        fetchHistory();
        const interval = setInterval(fetchHistory, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    // Fetch chart config when selected
    useEffect(() => {
        if (!selected) return;
        const fetchChart = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await axios.get(`/api/data/charts/${selected.file}`, { withCredentials: true });
                setChartConfig(res.data.chartConfig);
            } catch (err) {
                setError('Failed to fetch chart');
                setChartConfig(null);
            } finally {
                setLoading(false);
            }
        };
        fetchChart();
    }, [selected]);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-12">
            <h1 className="text-3xl font-bold mb-6">Your Charts</h1>
            {error && <div className="text-red-400 mb-2">{error}</div>}
            <div className="flex flex-wrap gap-4 mb-8">
                {analyses.map((a) => (
                    <button
                        key={a._id}
                        onClick={() => setSelected(a)}
                        className={`px-4 py-2 rounded-lg border ${selected?._id === a._id ? 'bg-purple-700 border-purple-400' : 'bg-gray-800 border-gray-700'} font-semibold`}
                    >
                        {files.find(f => f._id === a.file)?.originalName || 'Untitled'}
                    </button>
                ))}
            </div>
            {loading && <div>Loading chart...</div>}
            {chartConfig && (
                <div className="w-full max-w-2xl bg-gray-800 rounded-lg p-4">
                    <Bar
                        data={{
                            labels: chartConfig.labels,
                            datasets: chartConfig.datasets,
                        }}
                        options={{
                            responsive: true,
                            plugins: { legend: { labels: { color: 'white' } } },
                            scales: { x: { ticks: { color: 'white' } }, y: { ticks: { color: 'white' } } },
                        }}
                    />
                </div>
            )}
            {!chartConfig && !loading && <div>Select a chart to view.</div>}
        </div>
    );
};

export default Charts; 