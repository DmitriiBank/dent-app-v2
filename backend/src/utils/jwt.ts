import jwt, { Secret } from "jsonwebtoken";
import { Response } from "express";
import { User } from "../model/User";
import {TokenDbModel} from "../schemas/token.schema";

const validateEnv = () => {
    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
        throw new Error("JWT secrets are missing");
    }
};

validateEnv();

const ACCESS_EXPIRES_MS = 15 * 60 * 1000; // 15 minutes
const REFRESH_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const signToken = (id: string) =>
    jwt.sign({ id }, process.env.JWT_ACCESS_SECRET as Secret, {
        expiresIn: "15m",
    });

export const signRefreshToken = (id: string) =>
    jwt.sign({ id }, process.env.JWT_REFRESH_SECRET as Secret, {
        expiresIn: "7d",
    });

const resolveClientUrl = () => {
    const urlFromEnv = process.env.GOOGLE_CLIENT_URL;
    return urlFromEnv ? new URL(urlFromEnv) : null;
};

const resolveServerUrl = () => {
    const serverUrl = process.env.SERVER_URL;
    return serverUrl ? new URL(serverUrl) : null;
};

const isCrossSite = () => {
    const client = resolveClientUrl();
    const server = resolveServerUrl();

    if (!client || !server) return false;

    return client.hostname !== server.hostname;
};

export const saveToken = async (userId: string, refreshToken: string) => {
    const tokenData = await TokenDbModel.findOne({user: userId});
    if (tokenData) {
        tokenData.refreshToken = refreshToken;
        return tokenData.save();
    }
    const token = await TokenDbModel.create({user: userId, refreshToken})
    return token;
}

export const setAuthCookies = async (res: Response, token: string) => {
    const crossSite = isCrossSite();
    const useSecure = process.env.NODE_ENV === "production" || crossSite;
    const sameSite: "lax" | "none" = crossSite ? "none" : "lax";

    console.log(`🍪 Setting cookies: Secure=${useSecure}, SameSite=${sameSite}, CrossSite=${crossSite}`);

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: useSecure,
        sameSite,
        // sameSite: "lax",
        // secure: false,
       path: "/",
        maxAge: ACCESS_EXPIRES_MS,
    });

    // res.cookie("refreshJwt", refreshToken, {
    //     httpOnly: true,
    //     secure: useSecure,
    //     sameSite,
    //     // sameSite: "none",
    //     // secure: true,
    //     path: "/",
    //     maxAge: REFRESH_EXPIRES_MS,
    // });

    return { token};
};

export const removeToken = async (refreshToken: string) => {
    const tokenData = await TokenDbModel.deleteOne({refreshToken});
    return tokenData;
}
export const findToken = async (refreshToken: string) => {
    const tokenData = await TokenDbModel.findOne({refreshToken});
    return tokenData;
}

export const createSendToken = async (
    user: User,
    statusCode: number,
    res: Response
) => {
    const token = signToken(user._id.toString());
    // const refreshToken = signRefreshToken(user._id.toString());

    console.log("TOKEN:", token);

    // await saveToken(user._id.toString(), refreshToken);

   await setAuthCookies(res, token);


    res.status(statusCode).json({
        status: "success",
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar || null,
            provider: user.provider || "local",
            testResults: user.testResults || [],
        },
    });
};
