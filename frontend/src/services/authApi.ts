import type {LoginData} from "../types/quiz-types.ts";
import type {UserDto, User} from "../types/User.ts";
import {convertUserDtoToUser} from "../utils/tools.ts";
import axios from "axios";

export const API = (import.meta.env.VITE_API_URL ?? 'http://localhost:3555').replace(/\/+$/,'');

export async function authFetch<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("token") || "";
    const res = await fetch(`${API}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    if (!res.ok) {
        const msg = await safeText(res);
        throw new Error(msg || `HTTP ${res.status}`);
    }
    return (await safeJson<T>(res))!;
}


// export async function login({email, password} : LoginData) {
//     const res = await fetch(`${API}/api/v1/users/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({email, password})
//     });
//     if (!res.ok) throw new Error('Login failed');
//     return res.json();
// }

export const login = async (data: LoginData) => {
    const res = await axios({
        method: "POST",
        url: `${API}/api/v1/users/login`,
        data
    });
    if (!res) throw new Error('Login failed');
    return res.data;
}

export async function register(data: UserDto) {
    const newUser = await convertUserDtoToUser(data)
    const res = await fetch(`${API}/api/v1/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
    });
    if (!res.ok) throw new Error(await res.text().catch(() => 'Register failed'));
    const payload = await res.json() as { token: string; user: User };
    if (payload?.token) localStorage.setItem('token', payload.token);
    return payload.user;
}

export function exit() {
    localStorage.removeItem('token');
    return true
}

export async function getMe() {
    return authFetch("/api/v1/users/me", { method: "GET" });
}

// utils
async function safeText(res: Response) {
    try { return await res.text(); } catch { return ""; }
}
async function safeJson<T>(res: Response) {
    try { return (await res.json()) as T; } catch { return undefined; }
}