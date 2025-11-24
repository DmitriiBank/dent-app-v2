export type AuthTokens = {
    accessToken: string;
    refreshToken: string;
};

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const isBrowser = typeof window !== 'undefined';

export const getAccessToken = () => isBrowser ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
export const getRefreshToken = () => isBrowser ? localStorage.getItem(REFRESH_TOKEN_KEY) : null;

export const setTokens = async (tokens?: AuthTokens | null) => {
    if (!isBrowser) return;
    if (!tokens?.accessToken || !tokens?.refreshToken) {
        clearTokens();
        throw new Error('Invalid tokens payload');
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
};

export const clearTokens = () => {
    if (!isBrowser) return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};