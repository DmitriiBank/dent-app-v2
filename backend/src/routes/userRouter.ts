import express from "express";

import * as authController from '../controllers/authController';
import * as userController from '../controllers/userController';
import * as authService from '../middleware/authMiddleware';
import { validateRequest } from "../middleware/validateRequest";
import {Roles} from "../utils/quizTypes";
import { refreshSchema, updatePasswordSchema } from "../validation/authSchemas";
import { adminCreateUserSchema, adminUpdateUserSchema, updateMeSchema } from "../validation/userSchemas";
export const userRouter = express.Router()

userRouter.post('/refresh', validateRequest(refreshSchema), authController.refresh);
userRouter.post('/logout', authController.logout);

userRouter.use(authService.protect);

userRouter.get('/me', authController.me);

userRouter.patch('/updatePassword', validateRequest(updatePasswordSchema), authController.updatePassword);
userRouter.patch('/updateMe', validateRequest(updateMeSchema), userController.updateMe)
userRouter.delete('/deleteMe',  userController.deleteMe)
userRouter.get('/audit-logs', authService.restrictTo(Roles.ADMIN), userController.getAuditLogs);

userRouter
    .route('/')
    .get(authService.restrictTo(Roles.ADMIN, Roles.TEACHER), userController.getAllUsers)
    .post(authService.restrictTo(Roles.ADMIN), validateRequest(adminCreateUserSchema), userController.createUser);

userRouter
    .route('/:id')
    .get(authService.restrictTo(Roles.ADMIN, Roles.TEACHER), userController.getUserById)
    .patch(authService.restrictTo(Roles.ADMIN), validateRequest(adminUpdateUserSchema), userController.updateUser)
    .delete(authService.restrictTo(Roles.ADMIN), userController.deleteUser);
