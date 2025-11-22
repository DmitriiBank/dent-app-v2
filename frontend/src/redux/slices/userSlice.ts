import {
    createAsyncThunk,
    createSlice,
    type PayloadAction
} from "@reduxjs/toolkit";
import type { User } from "../../types/User.ts";
import {getUserData} from "../../services/accountApi.ts";

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


export const fetchUser = createAsyncThunk(
    "user/fetchUser",
    async (userId: string) => {
            return await getUserData(userId);
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
            .addCase(fetchUser.rejected, (state) => {
                state.loading = false;
                state.data = null;
                state.error = 'Failed to fetch user';
            });
    }
});

export const { clearUser, clearError } = userSlice.actions;
export default userSlice.reducer;