import {Request, Response} from "express";
import {QuestionModel} from "../schemas/question.schema";
import * as factory from './handlerFactory';
import {APIFeatures} from "../utils/apiFeatures";
import { HttpError } from "../errorHandler/HttpError";
import { AuthRequest } from "../utils/quizTypes";
import { writeAuditLog } from "../utils/audit";

export const getAllQuestions = factory.getAll(QuestionModel);

export const getQuestionById = async (req: Request, res: Response) => {
    const quizId = req.params.id;
    const questionId = req.params.questionId ?? req.params.id;

    const question = await QuestionModel.findOne({ _id: questionId, quiz: quizId });
    if (!question) {
        throw new HttpError(404, 'Question not found');
    }

    res.status(200).json({
        status: 'success',
        data: question,
    });
};

export const createQuestion = async (req: Request, res: Response) => {
    const quizId = req.params.id;
    const question = await QuestionModel.create({
        ...req.body,
        quiz: quizId,
    });

    await writeAuditLog(req as AuthRequest, {
        action: "question.create",
        entityType: "question",
        entityId: String(question._id),
        details: {
            quizId,
        },
    });

    res.status(201).json({
        status: 'success',
        data: question,
    });
};

export const updateQuestion = async (req: Request, res: Response) => {
    const quizId = req.params.id;
    const questionId = req.params.questionId ?? req.params.id;

    const updatedQuestion = await QuestionModel.findOneAndUpdate(
        { _id: questionId, quiz: quizId },
        req.body,
        { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
        throw new HttpError(404, 'Question not found');
    }

    await writeAuditLog(req as AuthRequest, {
        action: "question.update",
        entityType: "question",
        entityId: String(updatedQuestion._id),
        details: {
            quizId,
            changedFields: Object.keys(req.body),
        },
    });

    res.status(200).json({
        status: 'success',
        data: updatedQuestion,
    });
};

export const deleteQuestion = async (req: Request, res: Response) => {
    const quizId = req.params.id;
    const questionId = req.params.questionId ?? req.params.id;

    const deletedQuestion = await QuestionModel.findOneAndDelete({ _id: questionId, quiz: quizId });
    if (!deletedQuestion) {
        throw new HttpError(404, 'Question not found');
    }

    await writeAuditLog(req as AuthRequest, {
        action: "question.delete",
        entityType: "question",
        entityId: String(deletedQuestion._id),
        details: {
            quizId,
        },
    });

    res.status(204).json({ status: 'success', data: null });
};

export const getQuizQuestions = async (req: Request, res: Response) => {
    const { id: quizId } = req.params;

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
