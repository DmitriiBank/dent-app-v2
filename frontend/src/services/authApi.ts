import type {LoginData} from "../types/quiz-types.ts";
import type {User, UserDto} from "../types/User.ts";
import {convertUserDtoToUser} from "../utils/tools.ts";
import {httpRequest} from "./http.ts";
// import type {GetUserResponseData} from "./accountApi.ts";

export const login = async (data: LoginData) => {
    const res = await httpRequest<{ data: User}>(`/api/v1/auth/login`, {
        method: "POST",
        credentials: "include",
        json: data,
    });
    return res.data as User;
}

export const register = async (data: UserDto) => {
    const newUser = await convertUserDtoToUser(data)
    const res = await httpRequest<{ data: User }>(`/api/v1/auth/signup`, {
        method: "POST",
        credentials: "include",
        json: newUser,
    });
    return res.data as User;
}

export const meRequest = async () =>  {
    const res = await httpRequest<{ data: User}>(`/api/v1/users/me`, {
        method: "GET",
        credentials: "include",
    });
    return res.data as User;
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

export const exit = async (): Promise<void> => {
    return await httpRequest(`/api/v1/users/logout`, {
        method: "POST",
        credentials: "include"
    });
}
