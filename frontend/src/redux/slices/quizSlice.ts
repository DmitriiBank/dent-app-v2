
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllQuizzes, getQuiz } from "../../services/quizApi";
import type {Quiz} from "../../types/quiz-types.ts";

export const fetchQuizzes = createAsyncThunk("quiz/fetchAll", async () => {
    return await getAllQuizzes();
});

export const fetchQuiz = createAsyncThunk("quiz/fetchOne", async (id: string) => {
    return await getQuiz(id);
});

interface QuizState {
    list: Quiz[];
    data: Quiz | null;
    loading: boolean;
    error: string | null;
}

const initialState: QuizState = {
    list: [],
    data: null,
    loading: false,
    error: null,
};

const quizSlice = createSlice({
    name: "quiz",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetch all
            .addCase(fetchQuizzes.pending,   s => { s.loading = true; s.error = null; })
            .addCase(fetchQuizzes.fulfilled, (s,a) => { s.loading = false; s.list = a.payload; })
            .addCase(fetchQuizzes.rejected,  (s,a) => { s.loading = false; s.error = a.error.message ?? 'Ошибка загрузки тестов'; })

            // fetch one
            .addCase(fetchQuiz.pending,   s => { s.loading = true; s.error = null; })
            .addCase(fetchQuiz.fulfilled, (s,a) => { s.loading = false; s.data = a.payload})
            .addCase(fetchQuiz.rejected,  (s,a) => { s.loading = false; s.error = a.error.message ?? 'Ошибка загрузки теста'; });

    },
});

export default quizSlice.reducer;
