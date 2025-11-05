import express from 'express';
import * as questionController from '../controllers/questionController.js';
export const questionRouter = express.Router({ mergeParams: true });
questionRouter.route('/')
    .get(questionController.getAllQuestions)
    .post(questionController.createQuestion);
questionRouter.route('/:id').delete(questionController.deleteQuestion).patch(questionController.updateQuestion);
