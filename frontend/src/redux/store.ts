import {combineReducers, configureStore} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.ts";
import langReducer from "./slices/langSlice.ts";
import userReducer from "./slices/userSlice.ts";
import quizReducer from "./slices/quizSlice.ts";
import storage from "redux-persist/lib/storage";
import {
    persistReducer, persistStore,
    FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
} from 'redux-persist';

const rootReducer = combineReducers({
    auth: authReducer,
    lang: langReducer,
    user: userReducer,
    quiz: quizReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['lang', 'auth'], // минимум 'lang'; 'auth' — по желанию
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefault) =>
        getDefault({
            serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
        }),
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch