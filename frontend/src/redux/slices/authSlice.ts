import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import type {GetUserResponseData, User} from "../../types/User.ts";
import {getUserData} from "../../services/accountApi.ts";

import type {LoginData} from "../../types/quiz-types.ts";
import {login} from "../../services/authApi.ts";

export interface AuthState {
    isAuth: boolean;
    isLoading: boolean;
    data:  User | null;
}

const initialState: AuthState = {
    data: null,
    isAuth: false,
    isLoading: false,
};

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (loginData: LoginData) => {
        const res = await login(loginData) as GetUserResponseData;
        console.log(res)
        return res.data as User;
    }
);


export const fetchCurrentUser = createAsyncThunk<User>(
    "auth/me",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getUserData() as GetUserResponseData;
            console.log(res);
            return res.data as User;
        } catch  {
            return rejectWithValue("unauthorized");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
            state.isAuth = false;
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
            .addCase(loginUser.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.isAuth = true;
                state.data = payload;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.isAuth = true;
                state.data = payload;
            });
    },
});

export const { logout, updateTestResults } = authSlice.actions;
export default authSlice.reducer;
