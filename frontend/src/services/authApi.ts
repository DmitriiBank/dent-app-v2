import type {LoginData} from "../types/quiz-types.ts";
import type {UserDto} from "../types/User.ts";
import {convertUserDtoToUser} from "../utils/tools.ts";
import {httpRequest} from "./http.ts";
// import type {GetUserResponseData} from "./accountApi.ts";

export const login = async (data: LoginData) => {
    return httpRequest(`/api/v1/users/login`, {
        method: "POST",
        auth: false,
        json: data,
    });
}

export async function register(data: UserDto) {
    const newUser = await convertUserDtoToUser(data)
    return await httpRequest(`/api/v1/users/signup`, {
        method: "POST",
        auth: false,
        json: newUser,
    });
}

export const forgotPassword = async (email: string) => {
    return httpRequest<{ data: { email: string } }>(`/api/v1/users/forgotPassword`, {
        method: "POST",
        auth: false,
        json: {email},
    });
}


export const resetPassword = async (token: string, password: string, passwordConfirm: string) => {
    return httpRequest<{ data: { password: string, passwordConfirm: string } }>(`/api/v1/users/resetPassword/${token}`, {
        method: "POST",
        auth: false,
        json: {password, passwordConfirm},
    });
}
export function exit() {
    return httpRequest(`/api/v1/users/logout}`, {
        method: "POST"
    });
}
