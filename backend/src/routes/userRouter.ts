import express from "express";
import * as userController from '../controllers/userController';
import * as authController from '../controllers/authController';
import * as authService from '../middleware/authMiddleware';
import {Roles} from "../utils/quizTypes";

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
    // .get(userController.getAllUsers)
    .post(userController.createUser);

userRouter.get('/users_list', userController.getAllUsers);

userRouter
    .route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);
