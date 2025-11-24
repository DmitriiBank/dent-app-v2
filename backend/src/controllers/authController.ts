import {UserDbModel} from '../schemas/user.schema';
import {HttpError} from '../errorHandler/HttpError';
import {sendEmail} from '../utils/email';
import {NextFunction, Request, Response} from "express";
import {logger} from "../Logger/winston";
import {
    accountServiceImplMongo as service
} from "../services/AccountServiceImplMongo";
import {AuthRequest} from "../utils/quizTypes";
import {asAuth} from "../utils/tools";
import {
    createSendToken,
    saveToken,
    signRefreshToken,
    signToken
} from "../utils/jwt";
import {User} from "../model/User";
import jwt from "jsonwebtoken";

import axios from "axios";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    if (!body || Object.keys(body).length === 0) {
        return next(new HttpError(400, 'Invalid data'));
    }
    const newUser = await service.signup(body);
    await createSendToken(newUser, 201, res);
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return next(new HttpError(400, 'Please provide email and password'));
    }
    const user = await service.login(email, password);

    await createSendToken(user, 200, res);
};


export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserDbModel.findOne({email: req.body.email});
    if (!user) {
        return next(new HttpError(404, 'There is no user found with that email'));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});
    const frontendUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:5173'
        : 'https://dent-app-v2.vercel.app';
    const resetURL = `${frontendUrl}/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a Patch request with your new password and passwordConfirm to: ${resetURL}\n If you didn't forget your password, please log in again.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 minutes)',
            message,
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email',
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false});

        return next(new HttpError(500, 'There was an error sending the email. Try again later.'));

    }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.params.token;
    if (!token) {
        logger.error(`${new Date().toISOString()} => Token is empty`);
        throw new HttpError(400, "Token is empty");
    }
    const {password, passwordConfirm} = req.body;
    if (!password || !passwordConfirm) {
        logger.error(`${new Date().toISOString()} => Password invalid`);
        throw new HttpError(400, "Password invalid");
    }
    const result = await service.resetPassword(token, password, passwordConfirm);

    await createSendToken(result, 200, res);
};


export const updatePassword = asAuth(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user._id;
    const {newPassword, newPasswordConfirm, passwordCurrent} = req.body;
    if (!newPassword || !newPasswordConfirm) {
        logger.error(`${new Date().toISOString()} => New password invalid`);
        throw new HttpError(400, "New password invalid");
    }

    const result = await service.updatePassword(userId, passwordCurrent, newPassword, newPasswordConfirm);

    await createSendToken(result, 200, res);
});


export const googleCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User | undefined;

        if (!user) {
            throw new HttpError(401, 'Authentication failed');
        }

        const accessToken = signToken(user._id.toString());
        const refreshToken = signRefreshToken(user._id.toString());

        await saveToken(user._id.toString(), refreshToken);

        const redirectUrl = new URL(`${process.env.GOOGLE_CLIENT_URL}/auth/success`);
        redirectUrl.searchParams.set('accessToken', accessToken);
        redirectUrl.searchParams.set('refreshToken', refreshToken);

        res.redirect(redirectUrl.toString());

    } catch (error) {
        next(error);
    }
}

export const me = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
   if(!user) {
       return res.status(401).json({
           status: 'error',
           message: 'User does not exist'
       })
   }
       res.status(200).json({
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
       })
}
export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.body?.refreshToken || req.headers.authorization?.split(' ')[1];

        if (!refreshToken) {
            return next(new HttpError(400, 'No refresh token provided'));
        }

        await service.logout(refreshToken);

        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully',
            // removeToken: token,
        });

    } catch (error) {
        next(error);
    }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.body?.refreshToken || req.headers.authorization?.split(' ')[1];

    if (!token) return next(new HttpError(401, 'No refresh token provided'));

    try {
        const user = await service.refresh(token);
        if (!user) return next(new HttpError(401, 'User not found'));

        await createSendToken(user, 200, res);
    } catch (e) {
        next(new HttpError(401, 'Invalid refresh token'));
    }
};
