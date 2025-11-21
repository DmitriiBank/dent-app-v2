import {httpRequest} from "./http.ts";
import type { User } from "../types/User.ts";

type GetUsersResponse = {
    status: string;
    results: number;
    data: User[];
};

type GetUserResponseData = {
    status: string;
    data: User;
}

export async function getUserData(): Promise<User> {
    const res = await httpRequest<GetUserResponseData>(`/api/v1/users/me`);
    console.log(res)
    return res.data;
}


export async function getAllUsers(): Promise<GetUsersResponse> {
    return httpRequest<GetUsersResponse>(`/api/v1/users`, {
        method: "GET",
    });
}

export async function deleteUser(id: string){
  await httpRequest<GetUsersResponse>(`/api/v1/users/${id}`, {
        method: "DELETE",
    });
}