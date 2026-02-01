import {Response} from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import {User} from "../model/User";
import {TokenDbModel} from "../schemas/token.schema";


export const signToken = (id: string) =>
    jwt.sign({id}, env.JWT_ACCESS_SECRET, {
        expiresIn: "15m",
    });

export const signRefreshToken = (id: string) =>
    jwt.sign({id},env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });


export const saveToken = async (userId: string, refreshToken: string) => {
    const tokenData = await TokenDbModel.findOne({user: userId});
    if (tokenData) {
        tokenData.refreshToken = refreshToken;
        return tokenData.save();
    }
    return await TokenDbModel.create({user: userId, refreshToken: refreshToken})

}


export const removeToken = async (token: string) => {
    return await TokenDbModel.findOneAndDelete({token});

}
export const findToken = async (refreshToken: string) => {
    const tokenData = await TokenDbModel.findOne({refreshToken});
    return tokenData;
}

export const createSendToken = async (user: User,
                                      statusCode: number,
                                      res: Response) => {
    const token = signToken(user._id);
    const refreshToken = signRefreshToken(user._id);



    res.cookie("token", token, {
       httpOnly: true,
        sameSite:env.NODE_ENV === "production" ? "none" : "lax",
        secure:env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
    });

    await saveToken(user._id, refreshToken);

    res.status(statusCode).json({
        status: 'success',
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