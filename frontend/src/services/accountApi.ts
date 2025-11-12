import {authFetch} from "./authApi.ts";
import type { User } from "../types/User.ts";

type GetUsersResponse = {
    status: string;
    results: number;
    data: User[];
};

export async function getUserData(): Promise<User> {
    return authFetch<User>(`/api/v1/users/me`, {method: "GET"});
}

export async function getAllUsers(): Promise<GetUsersResponse> {
    const res = await authFetch<GetUsersResponse>(`/api/v1/users/`, {
        method: "GET",
    });
    return res;
}

export async function deleteUser(id: string){
  await authFetch<GetUsersResponse>(`/api/v1/users/${id}`, {
        method: "DELETE",
    });
}