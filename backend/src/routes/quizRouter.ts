import express from "express";
import * as authService from '../middleware/authMiddleware';
import * as controller from "../controllers/quizController";
import {questionRouter} from "./questionRouter";
import {Roles} from "../utils/quizTypes";
import * as userController from "../controllers/userController";

export const quizRouter = express.Router()


quizRouter
    .route('/')
    .get(controller.getAllQuizzes)
    .post(authService.protect, authService.restrictTo(<Roles>"admin"), controller.addQuiz);

quizRouter.use('/:id/questions', questionRouter);


quizRouter
    .route('/:id')
    .get(controller.getQuizById)
    .patch(authService.protect, authService.restrictTo(<Roles>"admin"), controller.updateQuiz)
    .delete(authService.protect, authService.restrictTo(<Roles>"admin"), controller.deleteQuiz);

quizRouter.post('/:id/results', authService.protect, controller.saveQuizResult);

