import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface LangState {
    language: 'ru' | 'he';
}

const initialState: LangState = {
    language: 'ru',
};

const langSlice = createSlice({
    name: 'lang',
    initialState,
    reducers: {
        setLanguage(state, action: PayloadAction<'ru' | 'he'>) {
            state.language = action.payload;
        },
    },
});

export const { setLanguage } = langSlice.actions;
export default langSlice.reducer;
