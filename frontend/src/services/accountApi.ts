import {httpRequest} from "./http.ts";

import type {User} from "../types/User.ts";

export async function getAllUsers() {
    const res = await httpRequest<{ data: User[] }>(`/api/v1/users`, {
        method: "GET",
    });
    return res.data;
}
export async function getUserData(id: string){
    const res = await httpRequest<{ data: User }>(`/api/v1/users/${id}`, {
        method: "GET",
    });
    return res.data;
}

export async function deleteUser(id: string){
  await httpRequest(`/api/v1/users/${id}`, {
        method: "DELETE",
    });
}