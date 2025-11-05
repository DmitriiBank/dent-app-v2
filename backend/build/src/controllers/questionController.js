import { QuestionModel } from "../validators/question.schema.js";
import * as factory from './HandlerFactory.js';
export const getAllQuestions = async (req, res, next) => {
    let filter = {};
    if (req.params.quizId)
        filter = { quiz: req.params.quizId };
    const questions = await QuestionModel.find(filter);
    res.status(200).json({
        status: 'success',
        results: questions.length,
        data: {
            questions,
        },
    });
};
export const createQuestion = async (req, res, next) => {
    if (!req.body.tour)
        req.body.quiz = req.params.quizID;
    if (!req.body.user)
        req.body.user = req.user.id;
    const question = await QuestionModel.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            question,
        },
    });
};
export const updateQuestion = factory.updateOne(QuestionModel);
export const deleteQuestion = factory.deleteOne(QuestionModel);
