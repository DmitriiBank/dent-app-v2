import express from "express";
import * as authController from '../controllers/authController.js';
import { QuizController } from "../controllers/quizController.js";
export const quizRouter = express.Router();
const controller = new QuizController();
quizRouter.use('/:quizId/questions', quizRouter);
quizRouter
    .route('/')
    .get(controller.getAllQuiz)
    .post(controller.addQuiz);
// quizRouter.post('/result', userController.addTestResult);
quizRouter
    .route('/:id')
    .get(controller.getQuizById)
    // .patch(controller.updateQuiz)
    .delete(authController.protect, controller.removeQuiz);
