import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import type {User} from "../../types/User.ts";
import {getUserData} from "../../services/accountApi.ts";

import type {LoginData} from "../../types/quiz-types.ts";
import {login} from "../../services/authApi.ts";


export interface AuthState {
    isAuth: boolean;
    isLoading: boolean;
    data: User | null;        // ВСЕ данные только здесь
    token: string | null;
}

const initialState: AuthState = {
    data:  null,
    token:  null,
    isAuth: false,
    isLoading: false,
};

export interface LoginApiResponse {
    token: string;
    data: User;
}

export const loginUser = createAsyncThunk<LoginApiResponse, LoginData>(
    "auth/loginUser",
    async (loginData) => {
        const {data, token} = await login(loginData) as LoginApiResponse;
        console.log(data, token)
        return {
            data: data,
            token: token,
        }
    }
);

export const fetchCurrentUser = createAsyncThunk<User>(
    "auth/me",
    async () => {
        const res = await getUserData();
        console.log(res, "clean res")
        return res as User;
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // loginAction: (state, {payload}) => {
        //     Object.assign(state, payload);
        //     state.isAuth = true;
        //     state.isLoading = false;
        //     localStorage.setItem("user", JSON.stringify(payload));
        // },
        logout: (state) => {
            state.data = null;
            state.token = null;
            state.isAuth = false;
            state.isLoading = false;
            localStorage.removeItem("user");
        },
        updateTestResults: (state, { payload }) => {
            if (state.data) {
                state.data.testResults = payload;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, {payload}) => {
                state.isLoading = false;
                state.isAuth = true;
                state.data = payload.data;
                state.token = payload.token;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, {payload}) => {
                state.isAuth = true;
                state.isLoading = false;
                state.data = payload;
            });
    },
});

export const {updateTestResults, logout} = authSlice.actions;

export default authSlice.reducer;