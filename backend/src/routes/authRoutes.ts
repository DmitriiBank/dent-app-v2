import express from "express";
import * as authController from "../controllers/authController";
import passport from "passport";

export const authRouter = express.Router()

authRouter.post('/signup', authController.signup);
authRouter.post('/login', authController.login);
authRouter.post('/forgotPassword', authController.forgotPassword);
authRouter.post('/resetPassword/:token', authController.resetPassword);

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    authController.googleCallback
);
