import express, {NextFunction, Response} from "express";
import * as userController from '../controllers/userController';
import * as authController from '../controllers/authController';
import {signToken} from '../controllers/authController';
import * as authService from '../middleware/authMiddleware';
import {AuthRequest, Roles} from "../utils/quizTypes";
import passport from "passport";
import {asAuth} from "../utils/tools";
import {HttpError} from "../errorHandler/HttpError";

export const userRouter = express.Router()

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.post('/resetPassword/:token', authController.resetPassword);

userRouter.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

userRouter.get(
    '/login/google/callback',
    passport.authenticate('google', { session: false }),
    asAuth((req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new HttpError(401, 'Authentication failed');
            }
            // createSendToken(req.user as any, 200, res);
            const token = signToken((req.user as any)._id);

            const frontendUrl = process.env.GOOGLE_CLIENT_URL || 'http://localhost:5173';
            res.redirect(`${frontendUrl}/auth/success?token=${token}`);
        } catch (error) {
            next(error);
        }
    })
);

userRouter.use(authService.protect);

userRouter.patch('/updatePassword',  authController.updatePassword);
userRouter.get('/me', userController.getMe, userController.getUserById);
userRouter.patch('/updateMe',   userController.updateMe)
userRouter.delete('/deleteMe',  userController.deleteMe)

userRouter.use(authService.restrictTo(<Roles>'admin'));

userRouter
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

// userRouter.get('/users_list', userController.getAllUsers);

userRouter
    .route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);
