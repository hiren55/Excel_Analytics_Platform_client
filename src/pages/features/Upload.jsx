import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle, ChevronRight, Home, CheckCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../components/ui/use-toast';
import { dataAPI } from '../../services/api';

const UploadPage = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const onDrop = useCallback((acceptedFiles) => {
        const excelFiles = acceptedFiles.filter(file =>
            file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')
        );

        if (excelFiles.length !== acceptedFiles.length) {
            setError('Please upload only Excel files (.xlsx, .xls) or CSV files (.csv)');
            showToast('Please upload only Excel or CSV files', 'error');
            return;
        }

        setFiles(excelFiles);
        setError(null);
        showToast(`${excelFiles.length} file(s) selected`, 'success');
    }, [showToast]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
            'text/csv': ['.csv']
        }
    });

    const handleUpload = async () => {
        if (files.length === 0) return;

        setUploading(true);
        setError(null);

        try {
            const uploadPromises = files.map(async (file) => {
                try {
                    const response = await dataAPI.upload(file);
                    return {
                        file: file,
                        response: response,
                        success: true
                    };
                } catch (error) {
                    return {
                        file: file,
                        error: error,
                        success: false
                    };
                }
            });

            const results = await Promise.all(uploadPromises);
            const successfulUploads = results.filter(result => result.success);
            const failedUploads = results.filter(result => !result.success);

            if (successfulUploads.length > 0) {
                showToast(`${successfulUploads.length} file(s) uploaded successfully!`, 'success');
                setUploadedFiles(prev => [...prev, ...successfulUploads]);

                // Show details of uploaded files
                successfulUploads.forEach(upload => {
                    const { file, response } = upload;
                    const rowCount = response.preview?.length || 0;
                    showToast(`${file.name} uploaded! ${rowCount} rows processed`, 'success');
                });
            }

            if (failedUploads.length > 0) {
                showToast(`${failedUploads.length} file(s) failed to upload`, 'error');
                failedUploads.forEach(upload => {
                    const { file, error } = upload;
                    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                    console.error(`Failed to upload ${file.name}:`, errorMessage);
                    showToast(`Failed to upload ${file.name}: ${errorMessage}`, 'error');
                });
            }

            setFiles([]);

            // Navigate to history after successful upload
            if (successfulUploads.length > 0) {
                setTimeout(() => {
                    navigate('/features/history');
                }, 2000);
            }

        } catch (err) {
            console.error('Upload error:', err);
            const errorMessage = err.response?.data?.message || 'Failed to upload files. Please try again.';
            setError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            {/* Breadcrumb Navigation */}
            <div className="flex items-center space-x-2 mb-6 text-gray-400">
                <Link to="/" className="flex items-center hover:text-purple-400 transition-colors">
                    <Home className="w-4 h-4 mr-1" />
                    Home
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-purple-400">Upload Excel</span>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Upload Excel Files</h1>
                <p className="text-gray-400">Upload your Excel files for analysis and visualization</p>
            </div>

            {/* Upload Area */}
            <div
                {...getRootProps()}
                className={`p-8 rounded-2xl border-2 border-dashed transition-colors duration-200 ${isDragActive
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-white/10 hover:border-purple-500/50'
                    }`}
            >
                <input {...getInputProps()} />
                <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                    <p className="text-lg text-white mb-2">
                        {isDragActive
                            ? 'Drop your Excel files here'
                            : 'Drag & drop Excel files here, or click to select'}
                    </p>
                    <p className="text-sm text-gray-400">
                        Supports .xlsx, .xls, and .csv files
                    </p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 flex items-center"
                >
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                </motion.div>
            )}

            {/* Success Message */}
            {uploadedFiles.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 flex items-center"
                >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {uploadedFiles.length} file(s) uploaded successfully! Redirecting to history...
                </motion.div>
            )}

            {/* File List */}
            {files.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8"
                >
                    <h2 className="text-xl font-semibold text-white mb-4">Selected Files</h2>
                    <div className="space-y-4">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center p-4 rounded-lg bg-white/5 border border-white/10"
                            >
                                <FileText className="w-6 h-6 text-purple-400 mr-4" />
                                <div className="flex-1">
                                    <p className="text-white font-medium">{file.name}</p>
                                    <p className="text-sm text-gray-400">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="mt-6 w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? 'Uploading...' : 'Upload Files'}
                    </button>
                </motion.div>
            )}

            {/* Features Preview */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-2">Data Validation</h3>
                    <p className="text-gray-400">Automatic validation of Excel data structure and format</p>
                </div>
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-2">Bulk Processing</h3>
                    <p className="text-gray-400">Upload and process multiple files simultaneously</p>
                </div>
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-2">Format Detection</h3>
                    <p className="text-gray-400">Smart detection of data types and relationships</p>
                </div>
            </div>
        </motion.div>
    );
};

export default UploadPage; 