import express from 'express';
import * as questionController from '../controllers/questionController';
import * as authService from '../middleware/authMiddleware';
import {Roles} from "../utils/quizTypes";

export const questionRouter= express.Router({mergeParams: true});

questionRouter.use(authService.protect);

questionRouter.route('/')
  .get (questionController.getQuizQuestions)
  .post( authService.restrictTo(<Roles>'admin'), questionController.createQuestion)

questionRouter.route('/:id').get (questionController.getQuestionById).delete(authService.restrictTo(<Roles>'admin'), questionController.deleteQuestion).patch(authService.restrictTo(<Roles>'admin'), questionController.updateQuestion)