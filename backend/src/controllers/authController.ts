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
import {createSendToken, signRefreshToken, signToken} from "../utils/jwt";


export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    if (body.length < 1) {
        return next(new HttpError(400, 'Invalid data'));
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
    res.status(200).json({
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


export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserDbModel.findOne({email: req.body.email});
    if (!user) {
        return next(new HttpError(404, 'There is no user found with that email'));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});
    const frontendUrl = process.env.NODE_ENV === 'development'
        ?  'http://localhost:5173'
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

export const googleCallback = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new HttpError(401, 'Authentication failed');
        }
        console.log(req.user);
        createSendToken(req.user, 200, res);

        res.redirect(`${process.env.GOOGLE_CLIENT_URL}/auth/success`);
    } catch (error) {
        next(error);
    }
}