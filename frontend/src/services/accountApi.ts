import {API, authFetch} from "./authApi.ts";
import type { User } from "../types/User.ts";

export async function getUserData(): Promise<User> {
    return authFetch<User>(`${API}/api/v1/users/me`, {method: "GET"});
}
