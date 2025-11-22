import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import type {GetUserResponseData, User} from "../../types/User.ts";
import {getUserData} from "../../services/accountApi.ts";
import type {LoginData} from "../../types/quiz-types.ts";
import {login, exit} from "../../services/authApi.ts";

export interface AuthState {
    isAuth: boolean;
    isLoading: boolean;
    data: User | null;
    error: string | null;
}

const initialState: AuthState = {
    data: null,
    isAuth: false,
    isLoading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (loginData: LoginData, { rejectWithValue }) => {
        try {
            const res = await login(loginData) as GetUserResponseData;
            console.log('Login response:', res);
            return res.data as User;
        } catch (error) {
            return rejectWithValue(error || 'Login failed');
        }
    }
);

export const fetchCurrentUser = createAsyncThunk<User>(
    "auth/me",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getUserData() as GetUserResponseData;
            console.log('Current user:', res);
            return res.data as User;
        } catch (error) {
            return rejectWithValue(error || 'Unauthorized');
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            // Используем httpRequest для единообразия
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3555';
            await fetch(`${API_BASE_URL}/api/v1/users/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            exit(); // Очищаем localStorage
            console.log('✅ Logout successful');
            return true;
        } catch (error) {
            console.error('❌ Logout failed:', error);
            return rejectWithValue(error);
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
            state.error = null;
        },
        updateTestResults: (state, { payload }) => {
            if (state.data) {
                state.data.testResults = payload;
            }
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.isAuth = true;
                state.data = payload;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuth = false;
                state.error = action.payload as string;
            })

            // Fetch current user
            .addCase(fetchCurrentUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.isAuth = true;
                state.data = payload;
                state.error = null;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuth = false;
                state.data = null;
                state.error = action.payload as string;
            })

            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.data = null;
                state.isAuth = false;
                state.error = null;
            });
    },
});

export const { logout, updateTestResults, clearError } = authSlice.actions;
export default authSlice.reducer;