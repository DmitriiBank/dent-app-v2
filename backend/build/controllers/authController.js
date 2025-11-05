"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.login = exports.signup = void 0;
const user_schema_1 = require("../schemas/user.schema");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HttpError_1 = require("../errorHandler/HttpError");
const email_1 = require("../utils/email");
const crypto_1 = __importDefault(require("crypto"));
const validateEnv = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    if (process.env.JWT_SECRET.length < 16) {
        throw new Error('JWT_SECRET must be at least 32 characters long');
    }
};
validateEnv();
const signToken = (id) => {
    const secret = process.env.JWT_SECRET;
    const options = {
        expiresIn: (process.env.JWT_EXPIRES_IN ?? '90d'),
    };
    return jsonwebtoken_1.default.sign({ id }, secret, options);
};
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieExpiresInDays = Number(process.env.JWT_COOKIE_EXPIRES_IN) || 7;
    const cookieOptions = {
        expires: new Date(Date.now() + cookieExpiresInDays * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    };
    res.cookie('jwt', token, cookieOptions);
    console.log(user);
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
const signup = async (req, res, next) => {
    const newUser = await user_schema_1.UserDbModel.create(req.body);
    createSendToken(newUser, 201, res);
};
exports.signup = signup;
const login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new HttpError_1.HttpError(400, 'Please provide email and password'));
    }
    const user = await user_schema_1.UserDbModel.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password)))
        return next(new HttpError_1.HttpError(401, "Incorrect email or password"));
    createSendToken(user, 200, res);
};
exports.login = login;
const forgotPassword = async (req, res, next) => {
    const user = await user_schema_1.UserDbModel.findOne({ email: req.body.email });
    if (!user) {
        return next(new HttpError_1.HttpError(404, 'There is no user found with that email'));
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a Patch request with your new password and passwordConfirm to: ${resetURL}.\n If you didn't forget your password, please log in again.`;
    try {
        await (0, email_1.sendEmail)({
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
        return next(new HttpError_1.HttpError(500, 'There was an error sending the email. Try again later.'));
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    const hashedToken = crypto_1.default.createHash('sha256').update(req.params.token).digest('hex');
    const user = await user_schema_1.UserDbModel.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
        return next(new HttpError_1.HttpError(400, 'Token is invalid or has expired'));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    createSendToken(user, 200, res);
};
exports.resetPassword = resetPassword;
const updatePassword = async (req, res, next) => {
    const user = await user_schema_1.UserDbModel.findById(req.user.id).select('+password');
    if (!user) {
        return next(new HttpError_1.HttpError(404, 'User not found.'));
    }
    const isCorrect = await user.correctPassword(req.body.passwordCurrent, user.password);
    if (!isCorrect) {
        return next(new HttpError_1.HttpError(401, 'Your current password is incorrect.'));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    createSendToken(user, 200, res);
};
exports.updatePassword = updatePassword;
