import {UserDbModel} from '../schemas/user.schema.js';
import jwt, {Secret, SignOptions} from 'jsonwebtoken';
import {HttpError} from '../errorHandler/HttpError.js';
import {sendEmail} from '../utils/email.js';
import crypto from 'crypto';
import {NextFunction, Request, Response} from "express";
import {User} from "../model/User.js";
import mongoose from "mongoose";

const validateEnv = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    if (process.env.JWT_SECRET.length < 16) {
        throw new Error('JWT_SECRET must be at least 32 characters long');
    }
};

validateEnv();

const signToken = (id: mongoose.Types.ObjectId): string => {
    const secret: Secret = process.env.JWT_SECRET as Secret;
    const options: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN ?? '90d')  as any,
    };
    return jwt.sign({ id }, secret, options);
};

const createSendToken = (user: User, statusCode: number, res: Response) => {
    const token = signToken(user._id);
    const cookieExpiresInDays = Number(process.env.JWT_COOKIE_EXPIRES_IN) || 7;

    const cookieOptions = {
        expires: new Date(Date.now() + cookieExpiresInDays * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
    };

    res.cookie('jwt', token, cookieOptions);

    console.log(user)
    const safeUser = user.toObject();
    safeUser.password = undefined;
    safeUser.passwordResetToken = undefined;
    safeUser.passwordResetExpires = undefined;
    safeUser.__v = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            safeUser
        },
    });
};


export const signup = async (req: Request , res: Response, next: NextFunction) => {
        const newUser = await UserDbModel.create(req.body);
        createSendToken(newUser, 201, res);
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return next(new HttpError(400, 'Please provide email and password'));
    }

    const user = await UserDbModel.findOne({email}).select('+password');
    if (!user || !(await user.correctPassword(password, user.password)))
        return next(new HttpError(401, "Incorrect email or password"));

   createSendToken(user, 200, res);
};



export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserDbModel.findOne({email: req.body.email});
    if (!user) {
        return next(new HttpError(404, 'There is no user found with that email'));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a Patch request with your new password and passwordConfirm to: ${resetURL}.\n If you didn't forget your password, please log in again.`;

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
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await UserDbModel.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()},
    });

    if (!user) {
        return next(new HttpError(400, 'Token is invalid or has expired'));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserDbModel.findById(req.user.id).select('+password');

    if (!user) {
        return next(new HttpError(404, 'User not found.'));
    }

    const isCorrect = await user.correctPassword(req.body.passwordCurrent, user.password);
    if (!isCorrect) {
        return next(new HttpError(401, 'Your current password is incorrect.'));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    createSendToken(user, 200, res);
};