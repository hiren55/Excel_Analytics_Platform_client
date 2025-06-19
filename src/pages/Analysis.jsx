import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { excelAPI, analysisAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../components/ui/use-toast';

const Analysis = () => {
    const { fileId } = useParams();
    const [file, setFile] = useState(null);
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('chart');
    const { showToast } = useToast();

    useEffect(() => {
        loadFileAndAnalyses();
    }, [fileId]);

    const loadFileAndAnalyses = async () => {
        try {
            const [fileResponse, analysesResponse] = await Promise.all([
                excelAPI.getById(fileId),
                analysisAPI.getAll({ excelFile: fileId })
            ]);
            setFile(fileResponse.data.data);
            setAnalyses(analysesResponse.data.data);
        } catch (error) {
            showToast('Failed to load file data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateAnalysis = async () => {
        try {
            setLoading(true);
            const response = await analysisAPI.create({
                name: `${file.originalName} - ${selectedType} analysis`,
                type: selectedType,
                excelFile: fileId,
                config: {
                    chartType: selectedType === 'chart' ? 'bar' : undefined,
                    dataRange: 'all',
                    options: {}
                }
            });
            showToast('Analysis started successfully', 'success');
            loadFileAndAnalyses();
        } catch (error) {
            showToast('Failed to start analysis', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAnalysis = async (analysisId) => {
        try {
            await analysisAPI.delete(analysisId);
            showToast('Analysis deleted successfully', 'success');
            loadFileAndAnalyses();
        } catch (error) {
            showToast('Failed to delete analysis', 'error');
        }
    };

    if (loading) {
        return <div className="container mx-auto py-8 text-center">Loading...</div>;
    }

    if (!file) {
        return <div className="container mx-auto py-8 text-center text-red-500">File not found</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{file.originalName}</h1>
                    <p className="text-gray-500">File Analysis Dashboard</p>
                </div>
                <div className="flex items-center space-x-4">
                    <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select analysis type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="chart">Chart Analysis</SelectItem>
                            <SelectItem value="report">Report Analysis</SelectItem>
                            <SelectItem value="insight">Insight Analysis</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleGenerateAnalysis}>Generate Analysis</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analyses.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500">
                        No analyses yet. Generate your first analysis to get started.
                    </div>
                ) : (
                    analyses.map((analysis) => (
                        <Card key={analysis._id}>
                            <CardHeader>
                                <CardTitle>{analysis.name}</CardTitle>
                                <CardDescription>
                                    Type: {analysis.type}
                                    <br />
                                    Status: {analysis.status}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {analysis.status === 'completed' && (
                                    <div className="space-y-4">
                                        {analysis.type === 'chart' && analysis.results.data && (
                                            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                                                {/* Chart visualization will go here */}
                                                <p className="text-gray-500">Chart Preview</p>
                                            </div>
                                        )}
                                        {analysis.type === 'insight' && analysis.results.insights && (
                                            <div className="space-y-2">
                                                {analysis.results.insights.map((insight, index) => (
                                                    <div key={index} className="p-2 bg-gray-50 rounded">
                                                        <p className="text-sm">{insight.text}</p>
                                                        <span className="text-xs text-gray-500">
                                                            Importance: {insight.importance}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {analysis.type === 'report' && analysis.results.recommendations && (
                                            <div className="space-y-2">
                                                {analysis.results.recommendations.map((rec, index) => (
                                                    <div key={index} className="p-2 bg-gray-50 rounded">
                                                        <p className="text-sm">{rec}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {analysis.status === 'processing' && (
                                    <div className="text-center py-4">
                                        <p className="text-gray-500">Processing analysis...</p>
                                    </div>
                                )}
                                {analysis.status === 'error' && (
                                    <div className="text-center py-4 text-red-500">
                                        <p>Error: {analysis.error?.message || 'Unknown error'}</p>
                                    </div>
                                )}
                                <div className="mt-4 flex justify-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteAnalysis(analysis._id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default Analysis; 