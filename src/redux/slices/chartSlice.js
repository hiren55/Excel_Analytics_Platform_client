import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    chartData: null,
    chartType: '2D',
};

const chartSlice = createSlice({
    name: 'chart',
    initialState,
    reducers: {
        setChartData(state, action) {
            state.chartData = action.payload;
        },
        setChartType(state, action) {
            state.chartType = action.payload;
        },
    },
});

export const { setChartData, setChartType } = chartSlice.actions;
export default chartSlice.reducer; 