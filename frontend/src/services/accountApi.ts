import {httpRequest} from "./http.ts";

import type {GetUsersResponseData, User} from "../types/User.ts";

export async function getAllUsers() {
    const res = await httpRequest<GetUsersResponseData>(`/api/v1/users`, {
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