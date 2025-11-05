import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.ts";
import langReducer from "./slices/langSlice.ts";
import userReducer from "./slices/userSlice.ts";
import quizReducer from "./slices/quizSlice.ts";

export const store = configureStore({
    reducer: {
        "auth": authReducer,
        "lang": langReducer,
        "user": userReducer,
        "quiz": quizReducer
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch