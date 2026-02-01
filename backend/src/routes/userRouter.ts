import express from "express";

import * as authController from '../controllers/authController';
import * as userController from '../controllers/userController';
import * as authService from '../middleware/authMiddleware';
import { validateRequest } from "../middleware/validateRequest";
import {Roles} from "../utils/quizTypes";
import { refreshSchema, updatePasswordSchema } from "../validation/authSchemas";
import { updateMeSchema } from "../validation/userSchemas";
export const userRouter = express.Router()

userRouter.post('/refresh', validateRequest(refreshSchema), authController.refresh);
 userRouter.use(authService.protect);

userRouter.get('/me', authController.me);
userRouter.post('/logout', authController.logout);

userRouter.patch('/updatePassword', validateRequest(updatePasswordSchema), authController.updatePassword);
userRouter.patch('/updateMe', validateRequest(updateMeSchema), userController.updateMe)
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
