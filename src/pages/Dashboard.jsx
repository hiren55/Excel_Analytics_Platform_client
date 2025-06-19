import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { excelAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../components/ui/use-toast';

const Dashboard = () => {
    const { user } = useAuth();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        try {
            const response = await excelAPI.getAll();
            setFiles(response.data.data);
        } catch (error) {
            showToast('Failed to load files', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            await excelAPI.upload(formData);
            showToast('File uploaded successfully', 'success');
            loadFiles();
        } catch (error) {
            showToast('Failed to upload file', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFile = async (fileId) => {
        try {
            await excelAPI.delete(fileId);
            showToast('File deleted successfully', 'success');
            loadFiles();
        } catch (error) {
            showToast('Failed to delete file', 'error');
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600">Welcome, {user?.name}</span>
                    <Button variant="outline" onClick={() => document.getElementById('fileInput').click()}>
                        Upload File
                    </Button>
                    <input
                        id="fileInput"
                        type="file"
                        accept=".xlsx,.xls"
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center">Loading...</div>
                ) : files.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500">
                        No files uploaded yet. Upload your first Excel file to get started.
                    </div>
                ) : (
                    files.map((file) => (
                        <Card key={file._id}>
                            <CardHeader>
                                <CardTitle>{file.originalName}</CardTitle>
                                <CardDescription>
                                    Uploaded {new Date(file.createdAt).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">
                                        Size: {(file.size / 1024).toFixed(2)} KB
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Status: {file.status}
                                    </p>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteFile(file._id)}
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => window.location.href = `/analysis/${file._id}`}
                                        >
                                            Analyze
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard; 