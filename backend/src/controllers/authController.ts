import {UserDbModel} from '../schemas/user.schema';
import jwt, {Secret, SignOptions} from 'jsonwebtoken';
import {HttpError} from '../errorHandler/HttpError';
import {sendEmail} from '../utils/email';
import {NextFunction, Request, Response} from "express";
import {User} from "../model/User";
import {logger} from "../Logger/winston.js";
import {
    accountServiceImplMongo as service
} from "../services/AccountServiceImplMongo.js";
import {AuthRequest} from "../utils/quizTypes";
import {asAuth} from "../utils/tools";

const validateEnv = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    if (process.env.JWT_SECRET.length < 16) {
        throw new Error('JWT_SECRET must be at least 32 characters long');
    }
};

validateEnv();

export const signToken = (id:string): string => {
    const secret: Secret = process.env.JWT_SECRET as Secret;
    const options: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN ?? '90d')  as any,
    };
    return jwt.sign({ id }, secret, options);
};

export const createSendToken = (user: User, statusCode: number, res: Response) => {
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

    // const url = `${process.env.GOOGLE_CLIENT_URL}/auth/success?token=${token}`;
    // res.redirect(url);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            safeUser
        },
    });
};


export const signup = async (req: Request , res: Response, next: NextFunction) => {
    const body = req.body;
    if(body.length < 1){
        return next(new HttpError(400, 'Please enter correct datas'));
    }
    const newUser = await service.signup(body);
        createSendToken(newUser, 201, res);
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return next(new HttpError(400, 'Please provide email and password'));
    }

    const user = await service.login(email, password);

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

    createSendToken(result, 200, res);
};


export const updatePassword = asAuth(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user._id;
    const {newPassword, newPasswordConfirm, passwordCurrent} = req.body;
    if (!newPassword || !newPasswordConfirm) {
        logger.error(`${new Date().toISOString()} => New password invalid`);
        throw new HttpError(400, "New password invalid");
    }

    const result = await service.updatePassword(userId, passwordCurrent, newPassword, newPasswordConfirm);

    createSendToken(result, 200, res);
});