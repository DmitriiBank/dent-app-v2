import express from "express";
import passport from "passport";

import * as authController from "../controllers/authController";
import { validateRequest } from "../middleware/validateRequest";
import {
    forgotPasswordSchema,
    loginSchema,
    refreshSchema,
    resetPasswordSchema,
    signupSchema,
} from "../validation/authSchemas";
export const authRouter = express.Router()

authRouter.post('/signup', validateRequest(signupSchema), authController.signup);
authRouter.post('/login', validateRequest(loginSchema), authController.login);
authRouter.post('/forgotPassword', validateRequest(forgotPasswordSchema), authController.forgotPassword);
authRouter.post('/resetPassword/:token', validateRequest(resetPasswordSchema), authController.resetPassword);
authRouter.post('/refresh', validateRequest(refreshSchema), authController.refresh);


authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'],accessType: "offline",
    prompt: "consent", }));

authRouter.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    authController.googleCallback
);
