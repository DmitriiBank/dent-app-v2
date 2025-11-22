import {
    createAsyncThunk,
    createSlice,
    type PayloadAction
} from "@reduxjs/toolkit";
import { getUserData } from "../../services/accountApi.ts";
import type { User, GetUserResponseData } from "../../types/User.ts";

interface UserState {
    data: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    data: null,
    loading: false,
    error: null,
};


export const fetchUser = createAsyncThunk<User, void, { rejectValue: string }>(
    "user/fetchUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getUserData() as GetUserResponseData;
            return response.data;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch user';
            return rejectWithValue(message);
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUser: (state) => {
            state.data = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.data = null;
                state.error = action.payload ?? 'Failed to fetch user';
            });
    }
});

export const { clearUser, clearError } = userSlice.actions;
export default userSlice.reducer;