import express from "express";
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';
export const userRouter = express.Router();
userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.post('/resetPassword/:token', authController.resetPassword);
userRouter.patch('/updatePassword', authController.protect, authController.updatePassword);
userRouter.get('/', userController.getAllUsers);
userRouter.patch('/updateMe', authController.protect, userController.updateMe);
userRouter.delete('/deleteMe', authController.protect, userController.deleteMe);
userRouter
    .route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);
