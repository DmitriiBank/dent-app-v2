import {httpRequest} from "./http.ts";
// import type { User } from "../types/User.ts";

// type GetUsersResponse = {
//     status: string;
//     results: number;
//     data: User[];
// };
//
// export type GetUserResponseData = {
//     status: string;
//     data: User;
// }

export async function getUserData() {
    return httpRequest( `/api/v1/users/me`, {
        method: "GET",
    });
}


export async function getAllUsers() {
    return httpRequest(`/api/v1/users`, {
        method: "GET",
    });
}

export async function deleteUser(id: string){
  await httpRequest(`/api/v1/users/${id}`, {
        method: "DELETE",
    });
}