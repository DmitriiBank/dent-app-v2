import {Request, Response} from "express";
import {QuestionModel} from "../schemas/question.schema";
import * as factory from './handlerFactory';
import {APIFeatures} from "../utils/apiFeatures";

export const getQuizQuestions = async (req: Request, res: Response) => {
    const { quizId } = req.params;

    const features = new APIFeatures(
        QuestionModel.find({ quiz: quizId }),
        req.query
    )
        .sort()
        .paginate();

    const questions = await features.query;

    res.status(200).json({
        status: 'success',
        page: req.query.page || 1,
        results: questions.length,
        data: { questions },
    });
};

export const getAllQuestions = factory.getAll(QuestionModel);
export const getQuestionById = factory.getOne(QuestionModel);
export const createQuestion = factory.createOne(QuestionModel);
export const updateQuestion = factory.updateOne(QuestionModel);
export const deleteQuestion = factory.deleteOne(QuestionModel);