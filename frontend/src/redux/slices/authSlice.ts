import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import type {TestRecord, User} from "../../types/User.ts";
import {getUserData} from "../../services/accountApi.ts";

import type {LoginData} from "../../types/quiz-types.ts";
import {login} from "../../services/authApi.ts";


export interface AuthState {
    _id: string | null;
    name: string | null;
    email: string | null;
    role: string | null;
    isAuth: boolean;
    isLoading: boolean;
    testResults: TestRecord[];
}

const initialState: AuthState = {
    _id: null,
    name: null,
    email: null,
    role: null,
    isAuth: false,
    isLoading: false,
    testResults: [],
};


export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (loginData: LoginData): Promise<User> => {
        const result = await login(loginData);
        const token = result.token;
        localStorage.setItem("token", token);
        return result.data.safeUser;
    }
);

export const fetchCurrentUser = createAsyncThunk<User>(
    "auth/me",
    async (): Promise<User> => {
        const res = await getUserData();

        if ("data" in res && res.data) {
            return res.data as User;
        }
        return res as User;
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginAction: (state, {payload}) => {
            Object.assign(state, payload);
            state.isAuth = true;
            state.isLoading = false;
            localStorage.setItem("user", JSON.stringify(payload));
        },
        logout: (state) => {
            Object.assign(state, initialState);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, {payload}) => {
                state.isLoading = false;
                state.isAuth = true;
                Object.assign(state, payload);
                localStorage.setItem("user", JSON.stringify(payload));
            })
            .addCase(fetchCurrentUser.fulfilled, (state, {payload}) => {
                state.isAuth = true;
                Object.assign(state, payload);
                localStorage.setItem("user", JSON.stringify(payload));
            });
    },
});

export const {loginAction, logout} = authSlice.actions;

export default authSlice.reducer;