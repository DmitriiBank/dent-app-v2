import jwt, {Secret} from 'jsonwebtoken';
import {Response} from 'express';
import {User} from "../model/User";

const validateEnv = () => {
    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    if (process.env.JWT_ACCESS_SECRET.length < 16 || process.env.JWT_REFRESH_SECRET.length < 16) {
        throw new Error('JWT_SECRET must be at least 32 characters long');
    }
};

validateEnv();

const ACCESS_TOKEN_EXPIRES = '15m';
const REFRESH_TOKEN_EXPIRES = '7d';

export const signToken = (id: string) =>
    jwt.sign({ id }, process.env.JWT_ACCESS_SECRET as Secret, {
        expiresIn: ACCESS_TOKEN_EXPIRES,
    });

export const signRefreshToken = (id: string) =>
    jwt.sign({ id }, process.env.JWT_REFRESH_SECRET as Secret, {
        expiresIn: REFRESH_TOKEN_EXPIRES,
    });

export const createSendToken = (user: User, statusCode: number, res: Response) => {
    const token = signToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());

    res.cookie('accessToken', token, {
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 min
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    });

    res.cookie('refreshToken', refreshToken, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
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
        }
    });
};