import express from 'express';

import * as controller from '../controllers/quizController';
import * as userController from '../controllers/userController';
import * as authService from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { Roles } from '../utils/quizTypes';
import { quizSchema, updateQuizSchema } from "../validation/contentSchemas";

import { questionRouter } from './questionRouter';


export const quizRouter = express.Router();

quizRouter
  .route('/')
  .get(controller.getAllQuizzes)
  .post(authService.protect, authService.restrictTo(Roles.ADMIN), validateRequest(quizSchema), controller.addQuiz);

quizRouter.use('/:id/questions', questionRouter);

quizRouter
  .route('/:id')
  .get(controller.getQuizById)
  .patch(authService.protect, authService.restrictTo(Roles.ADMIN), validateRequest(updateQuizSchema), controller.updateQuiz)
  .delete(authService.protect, authService.restrictTo(Roles.ADMIN), controller.deleteQuiz);

quizRouter.post('/:id/results', authService.protect, controller.saveQuizResult);
