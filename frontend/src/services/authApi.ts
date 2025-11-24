import type {LoginData} from "../types/quiz-types.ts";
import type {User, UserDto} from "../types/User.ts";
import {convertUserDtoToUser} from "../utils/tools.ts";
import {httpRequest} from "./http.ts";
import {
    type AuthTokens,
    clearTokens,
    getRefreshToken,
    setTokens
} from "./tokenService.ts";

export const login = async (data: LoginData) => {
    const res = await httpRequest<{ data: User; tokens: AuthTokens }>(`/api/v1/auth/login`, {
        method: "POST",
        auth:false,
        json: data,
    });
    console.log(res)
   await setTokens(res.tokens);
    return res.data as User;
}

export const register = async (data: UserDto) => {
    const newUser = await convertUserDtoToUser(data)
    const res = await httpRequest<{ data: User; tokens: AuthTokens }>(`/api/v1/auth/signup`, {
        method: "POST",
        auth:false,
        json: newUser,
    });
    console.log(res)
    await setTokens(res.tokens);
    return res.data as User;
}

export const meRequest = async () =>  {
    const res = await httpRequest<{ data: User; tokens: AuthTokens }>(`/api/v1/users/me`, {
        method: "GET",
    });
    // await setTokens(res.tokens);
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
    const res = await httpRequest<{ data: User; tokens: AuthTokens }>(`/api/v1/users/resetPassword/${token}`, {
        method: "POST",
        auth: false,
        json: {password, passwordConfirm},
    });

    await setTokens(res.tokens);
    return res;
}

export const exit = async (): Promise<void> => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        clearTokens();
        return;
    }

    await httpRequest(`/api/v1/users/logout`, {
        method: "POST",
        json: { refreshToken },
    });

    clearTokens();
}
