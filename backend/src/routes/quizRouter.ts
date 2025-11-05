import express from "express";
import * as authService from '../middleware/authMiddleware.js';
import * as controller from "../controllers/quizController.js";
import {questionRouter} from "./questionRouter.js";
import {Roles} from "../utils/quizTypes.js";
import * as userController from "../controllers/userController.js";

export const quizRouter = express.Router()


quizRouter
    .route('/')
    .get(controller.getAllQuizzes)
    .post(authService.protect, authService.restrictTo(<Roles>"admin"), controller.addQuiz);

quizRouter.use('/:quizId/questions', questionRouter);


quizRouter
    .route('/:quizId')
    .get(controller.getQuizById)
    .patch(authService.protect, authService.restrictTo(<Roles>"admin"), controller.updateQuiz)
    .delete(authService.protect, authService.restrictTo(<Roles>"admin"), controller.deleteQuiz)
    .post(authService.protect, userController.getMe, controller.saveQuizResult);

