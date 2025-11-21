import jwt, { Secret } from "jsonwebtoken";
import { Response } from "express";
import { User } from "../model/User";

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

export const createSendToken = (
    user: User,
    statusCode: number,
    res: Response
) => {
    const token = signToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());

    console.log("TOKEN:", token);


    res.cookie("jwt", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: ACCESS_EXPIRES_MS,
    });

    res.cookie("refreshJwt", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: REFRESH_EXPIRES_MS,
    });


    res.status(statusCode).json({
        status: "success",
        token,
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
