import express from "express";
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';
import * as authService from '../middleware/authMiddleware.js';
import {Roles} from "../utils/quizTypes.js";

export const userRouter = express.Router()


userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.post('/resetPassword/:token', authController.resetPassword);

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

userRouter
    .route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);
