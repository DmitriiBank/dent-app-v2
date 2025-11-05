import express from 'express';
import * as questionController from '../controllers/questionController.js';
import * as authService from '../middleware/authMiddleware.js';
import {Roles} from "../utils/quizTypes.js";

export const questionRouter= express.Router({mergeParams: true});

questionRouter.use(authService.protect);

questionRouter.route('/')
  .get (questionController.getQuizQuestions)
  .post( authService.restrictTo(<Roles>'admin'), questionController.createQuestion)

questionRouter.route('/:id').get (questionController.getQuestionById).delete(authService.restrictTo(<Roles>'admin'), questionController.deleteQuestion).patch(authService.restrictTo(<Roles>'admin'), questionController.updateQuestion)