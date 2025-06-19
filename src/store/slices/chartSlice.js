import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    chartData: null,
    selectedChart: null,
    loading: false,
    error: null,
    chartOptions: {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        }
    }
};

const chartSlice = createSlice({
    name: 'chart',
    initialState,
    reducers: {
        setChartData: (state, action) => {
            state.chartData = action.payload;
        },
        setSelectedChart: (state, action) => {
            state.selectedChart = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        updateChartOptions: (state, action) => {
            state.chartOptions = {
                ...state.chartOptions,
                ...action.payload
            };
        },
        resetChartState: (state) => {
            state.chartData = null;
            state.selectedChart = null;
            state.loading = false;
            state.error = null;
            state.chartOptions = {
                type: 'line',
                data: {
                    labels: [],
                    datasets: []
                }
            };
        }
    }
});

export const {
    setChartData,
    setSelectedChart,
    setLoading,
    setError,
    updateChartOptions,
    resetChartState
} = chartSlice.actions;

export default chartSlice.reducer; 