
import {
    createSlice,
    createAsyncThunk,
    type PayloadAction
} from "@reduxjs/toolkit";
import { getAllQuizzes, getQuiz } from "../../services/quizApi";
import type {Question, Quiz} from "../../types/quiz-types.ts";

export const fetchQuizzes = createAsyncThunk("quiz/fetchAll", async () => {
    return await getAllQuizzes();
});

export const fetchQuiz = createAsyncThunk("quiz/fetchOne", async (id: string) => {
    return await getQuiz(id);
});

interface QuizResultSnapshot {
    quizId: string;
    questions: Question[];
    answers: (number | null)[];
    score: number;
}

interface QuizState {
    list: Quiz[];
    data: Quiz | null;
    loading: boolean;
    error: string | null;
    lastResult: QuizResultSnapshot | null;
}

const initialState: QuizState = {
    list: [],
    data: null,
    loading: false,
    error: null,
    lastResult: null,
};

const quizSlice = createSlice({
    name: "quiz",
    initialState,
    reducers: {
        setLastResult(state, action: PayloadAction<QuizResultSnapshot | null>) {
            state.lastResult = action.payload;
        },
        eraseResults(state) {
            state.list = [];
            state.data = null;
            state.loading = false;
            state.error = null;
            state.lastResult = null;
        }
    },
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

export const { eraseResults, setLastResult } = quizSlice.actions;

export default quizSlice.reducer;
