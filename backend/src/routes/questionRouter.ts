import express from 'express';
import * as questionController from '../controllers/questionController';
import * as authService from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import {Roles} from "../utils/quizTypes";
import { createQuestionSchema, updateQuestionSchema } from "../validation/contentSchemas";

export const questionRouter= express.Router({mergeParams: true});

questionRouter.use(authService.protect);

questionRouter.route('/')
  .get (questionController.getQuizQuestions)
  .post(authService.restrictTo(Roles.ADMIN), validateRequest(createQuestionSchema), questionController.createQuestion)

questionRouter
  .route('/:questionId')
  .get(questionController.getQuestionById)
  .delete(authService.restrictTo(Roles.ADMIN), questionController.deleteQuestion)
  .patch(authService.restrictTo(Roles.ADMIN), validateRequest(updateQuestionSchema), questionController.updateQuestion);
