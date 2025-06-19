import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    uploads: [],
};

const uploadSlice = createSlice({
    name: 'upload',
    initialState,
    reducers: {
        addUpload(state, action) {
            state.uploads.push(action.payload);
        },
        setUploads(state, action) {
            state.uploads = action.payload;
        },
    },
});

export const { addUpload, setUploads } = uploadSlice.actions;
export default uploadSlice.reducer; 