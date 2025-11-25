import type {LoginData} from "../types/quiz-types.ts";
import type {GetUserResponseData, User, UserDto} from "../types/User.ts";
import {convertUserDtoToUser} from "../utils/tools.ts";
import {httpRequest} from "./http.ts";


export const login = async (data: LoginData) => {
    const res = await httpRequest<GetUserResponseData>(`/api/v1/auth/login`, {
        method: "POST",
        json: data,
        credentials: "include"
    });
    console.log(res)
    return res.data;
}

export const register = async (data: UserDto) => {
    const newUser = await convertUserDtoToUser(data)
    const res = await httpRequest<GetUserResponseData>(`/api/v1/auth/signup`, {
        method: "POST",
        auth:false,
        json: newUser,
        credentials: "include"
    });
    console.log(res)
    // await setTokens(res.token, res.refreshToken);
    return res.data;
}

export const meRequest = async () =>  {
    const res = await httpRequest<GetUserResponseData>(`/api/v1/users/me`, {
        method: "GET",
        credentials: "include",
        auth: true,
    });
    console.log("meRequest: ", res)
    // await setTokens(res.tokens);
    return res.data;
}
export const forgotPassword = async (email: string) => {
    return httpRequest(`/api/v1/users/forgotPassword`, {
        method: "POST",
        auth: false,
        json: {email},
        credentials: "include"
    });
}


export const resetPassword = async (token: string, password: string, passwordConfirm: string) => {
    const res = await httpRequest<{ data: User;  token: string, refreshToken: string  }>(`/api/v1/users/resetPassword/${token}`, {
        method: "POST",
        auth: false,
        json: {password, passwordConfirm},
        credentials: "include"
    });

    // await setTokens(res.token, res.refreshToken);
    return res;
}

export const exit = async (): Promise<void> => {
    await httpRequest(`/api/v1/users/logout`, {
        method: "POST",
        credentials: "include"
    });
}
