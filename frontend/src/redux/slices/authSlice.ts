import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import type {GetUserResponseData, User, UserDto} from "../../types/User.ts";
import type {LoginData} from "../../types/quiz-types.ts";
import {exit, login, meRequest, register} from "../../services/authApi.ts";

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

export const signupUser = createAsyncThunk(
    "auth/signupUser",
    async (registerData: UserDto, { rejectWithValue }) => {
        try {
            const res = await register(registerData) as GetUserResponseData;
            console.log('Register response:', res);
            return res.data as User;
        } catch (error) {
            return rejectWithValue(error || 'Register failed');
        }
    }
);

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
            const res = await meRequest() as GetUserResponseData;
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
            await exit();
            console.log('✅ Logout successful');
            return;
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


            builder
                .addCase(logoutUser.fulfilled, (state) => {
                state.data = null;
                state.isAuth = false;
                state.error = null;
            });
    },
});

export const { logout, updateTestResults} = authSlice.actions;
export default authSlice.reducer;