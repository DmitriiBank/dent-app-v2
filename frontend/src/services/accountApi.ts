import {httpRequest} from "./http.ts";

import type {AdminUserFormData, GetUsersResponseData, User} from "../types/User.ts";

const buildQuery = (params?: Record<string, string>) => {
    if (!params) return "";
    const searchParams = new URLSearchParams(params);
    const query = searchParams.toString();
    return query ? `?${query}` : "";
};

export async function getAllUsers(params?: Record<string, string>) {
    const res = await httpRequest<GetUsersResponseData>(`/api/v1/users${buildQuery(params)}`, {
        method: "GET",
        credentials: "include"
    });
    return res.data;
}
export async function getUserData(id: string){
    const res = await httpRequest<{ data: User }>(`/api/v1/users/${id}`, {
        method: "GET",
        credentials: "include",
    });
    return res.data;
}

export async function deleteUser(id: string){
  await httpRequest(`/api/v1/users/${id}`, {
        method: "DELETE",
      credentials: "include"
    });
}

export async function createUser(data: AdminUserFormData) {
    const res = await httpRequest<{ data: User }>(`/api/v1/users`, {
        method: "POST",
        json: data,
        credentials: "include",
    });
    return res.data;
}

export async function updateUser(id: string, data: Omit<AdminUserFormData, "password" | "passwordConfirm">) {
    const res = await httpRequest<{ data: User }>(`/api/v1/users/${id}`, {
        method: "PATCH",
        json: data,
        credentials: "include",
    });
    return res.data;
}
