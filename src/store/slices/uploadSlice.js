import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    files: [],
    uploadProgress: 0,
    isUploading: false,
    error: null,
    uploadedFiles: []
};

const uploadSlice = createSlice({
    name: 'upload',
    initialState,
    reducers: {
        setFiles: (state, action) => {
            state.files = action.payload;
        },
        setUploadProgress: (state, action) => {
            state.uploadProgress = action.payload;
        },
        setIsUploading: (state, action) => {
            state.isUploading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        addUploadedFile: (state, action) => {
            state.uploadedFiles.push(action.payload);
        },
        clearUploadState: (state) => {
            state.files = [];
            state.uploadProgress = 0;
            state.isUploading = false;
            state.error = null;
        }
    }
});

export const {
    setFiles,
    setUploadProgress,
    setIsUploading,
    setError,
    addUploadedFile,
    clearUploadState
} = uploadSlice.actions;

export default uploadSlice.reducer; 