import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {getUserData} from "../../services/accountApi.ts";
import type {User} from "../../types/User.ts";

interface UserState {
    data: User | null;
    loading: boolean;
}

const initialState: UserState = {
    data: null,
    loading: false,
};

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
    return await getUserData();
});

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => { state.loading = true; })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            });
    }
});

export default userSlice.reducer;
