import { UserDbModel } from '../validators/user.schema.js';
import jwt from 'jsonwebtoken';
import { HttpError } from '../errorHandler/HttpError.js';
import { sendEmail } from '../utils/email.js';
import crypto from 'crypto';
const signToken = (id) => {
    const secret = process.env.JWT_SECRET;
    const options = {
        expiresIn: (process.env.JWT_EXPIRES_IN ?? '90d'),
    };
    return jwt.sign({ id }, secret, options);
};
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id.toString());
    const cookieLifetimeDays = Number(process.env.JWT_COOKIE_EXPIRES_IN ?? 90);
    res.cookie('jwt', token, {
        expires: new Date(Date.now() + cookieLifetimeDays * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    });
    const userSafe = { ...user, password: undefined };
    res.status(statusCode).json({
        status: 'success',
        token,
        data: { user: userSafe },
    });
};
export const signup = async (req, res, next) => {
    const newUser = await UserDbModel.create(req.body);
    createSendToken(newUser, 201, res);
};
export const login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new HttpError(400, 'Please provide email and password'));
    }
    const user = await UserDbModel.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password)))
        return next(new HttpError(401, "Incorrect email or password"));
    createSendToken(user, 200, res);
};
export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // console.log(token);
    if (!token) {
        return next(new HttpError(401, 'You are not logged in! Please log in'));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(decoded);
    const currentUser = await UserDbModel.findById(decoded.id);
    if (!currentUser) {
        return next(new HttpError(401, 'The user belongs to this token does no longer exist!'));
    }
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new HttpError(401, 'User recently changed password! Please log in again.'));
    }
    req.user = currentUser;
    next();
};
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new HttpError(403, 'You do not have permission to perform this action'));
        }
        next();
    };
};
export const forgotPassword = async (req, res, next) => {
    const user = await UserDbModel.findOne({ email: req.body.email });
    if (!user) {
        return next(new HttpError(404, 'There is no user found with that email'));
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
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
    }
    catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new HttpError(500, 'There was an error sending the email. Try again later.'));
    }
};
export const resetPassword = async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await UserDbModel.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
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
export const updatePassword = async (req, res, next) => {
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
