
import {
    clearTokens,
    getAccessToken,
    getRefreshToken,
    setTokens,
    type AuthTokens
} from "./tokenService.ts";
const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3555').replace(/\/+$/, '');
const REFRESH_ENDPOINT = '/api/v1/users/refresh';
interface HttpOptions extends RequestInit {
    auth?: boolean;
    json?: unknown;
    retry?: boolean;
}

async function refreshTokens(): Promise<AuthTokens> {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        clearTokens();
        throw new Error('No refresh token available');
    }

    const res = await fetch(API_BASE + REFRESH_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
        clearTokens();
        throw new Error('Unable to refresh token');
    }

    const data = await res.json() as { tokens?: AuthTokens };

    if (!data.tokens?.accessToken || !data.tokens?.refreshToken) {
        clearTokens();
        throw new Error('Malformed refresh response');
    }

    setTokens(data.tokens);
    return data.tokens;
}

export async function httpRequest<T>(url: string, options: HttpOptions = {}) {
    const {auth = true, json, retry = true, ...rest} = options;

    const headers = new Headers(rest.headers as HeadersInit | undefined);
    headers.set("Content-Type", "application/json");

    if (auth) {
        const accessToken = getAccessToken();
        if (accessToken) {
            headers.set("Authorization", `Bearer ${accessToken}`);
        }
    }
    const requestOptions: RequestInit = {
        method: rest.method || "GET",
        mode: "cors",
        ...rest,
        headers
    };

    if (json) requestOptions.body = JSON.stringify(json);
    else if (rest.body) requestOptions.body = rest.body;

    const res = await fetch(API_BASE + url, requestOptions);

    if (res.status === 401 && auth && retry) {
        await refreshTokens();
        return httpRequest<T>(url, {...options, retry: false});
    }

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Request failed");
    }
    if (res.status === 204) return undefined as T;

    return res.json() as Promise<T>;
}
