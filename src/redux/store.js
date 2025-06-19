import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chartReducer from './slices/chartSlice';
import uploadReducer from './slices/uploadSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chart: chartReducer,
        upload: uploadReducer,
    },
}); 