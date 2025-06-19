import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/use-toast';
import { dataAPI } from '../services/api';

const Upload = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState([]);
    const [fileId, setFileId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setPreview([]);
        setFileId(null);
        setError('');
        setSuccess('');

        if (selectedFile) {
            showToast(`File selected: ${selectedFile.name}`, 'success');
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError('');
        setSuccess('');

        try {
            showToast('Uploading file...', 'loading');

            const response = await dataAPI.upload(file);

            setPreview(response.preview || []);
            setFileId(response.fileId);
            setSuccess('File uploaded and parsed!');
            showToast(`File uploaded successfully! ${response.preview?.length || 0} rows processed`, 'success');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Upload failed';
            setError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleGenerateChart = async () => {
        if (!fileId) return;

        try {
            showToast('Generating chart...', 'loading');
            await dataAPI.generateChart(fileId);
            setSuccess('Chart generated! Go to Charts page to view.');
            showToast('Chart generated successfully!', 'success');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Chart generation failed';
            setError(errorMessage);
            showToast(errorMessage, 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-12">
            <h1 className="text-3xl font-bold mb-6">Upload Excel File</h1>
            <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="mb-4 text-black"
            />
            <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="bg-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 mb-4"
            >
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
            {error && <div className="text-red-400 mb-2">{error}</div>}
            {success && <div className="text-green-400 mb-2">{success}</div>}
            {preview.length > 0 && (
                <div className="w-full max-w-2xl bg-gray-800 rounded-lg p-4 mt-4">
                    <h2 className="text-xl font-semibold mb-2">Preview (first 10 rows)</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr>
                                    {Object.keys(preview[0]).map((key) => (
                                        <th key={key} className="px-2 py-1 text-left text-purple-300">{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {preview.map((row, i) => (
                                    <tr key={i}>
                                        {Object.values(row).map((val, j) => (
                                            <td key={j} className="px-2 py-1 border-b border-gray-700">{val}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button
                        onClick={handleGenerateChart}
                        className="mt-4 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                        disabled={!fileId}
                    >
                        Generate Chart
                    </button>
                </div>
            )}
        </div>
    );
};

export default Upload; 