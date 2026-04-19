import {Request, Response} from "express";
import * as factory from "./handlerFactory";
import { HttpError } from "../errorHandler/HttpError";
import {QuizDbModel} from "../schemas/quiz.schema";
import {TestResult} from "../schemas/testResult.schema";
import {AuthRequest} from "../utils/quizTypes";
import { canRetakeQuiz } from "../utils/permissions";
import { writeAuditLog } from "../utils/audit";
import {asAuth} from "../utils/tools";


export const getAllQuizzes = factory.getAll(QuizDbModel);
export const getQuizById = factory.getOne(QuizDbModel, {path: "questions"})

export const addQuiz = async (req: Request, res: Response) => {
    const quiz = await QuizDbModel.create(req.body);

    await writeAuditLog(req as AuthRequest, {
        action: "quiz.create",
        entityType: "quiz",
        entityId: String(quiz._id),
        details: {
            title: quiz.title,
        },
    });

    res.status(201).json({ status: 'success', data: quiz });
};

export const updateQuiz = async (req: Request, res: Response) => {
    const quiz = await QuizDbModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!quiz) {
        throw new HttpError(404, 'Document not found');
    }

    await writeAuditLog(req as AuthRequest, {
        action: "quiz.update",
        entityType: "quiz",
        entityId: String(quiz._id),
        details: {
            changedFields: Object.keys(req.body),
        },
    });

    res.status(200).json({ status: 'success', data: quiz });
};

export const deleteQuiz = async (req: Request, res: Response) => {
    const quiz = await QuizDbModel.findByIdAndDelete(req.params.id);
    if (!quiz) {
        throw new HttpError(404, 'Document not found');
    }

    await writeAuditLog(req as AuthRequest, {
        action: "quiz.delete",
        entityType: "quiz",
        entityId: String(quiz._id),
        details: {
            title: quiz.title,
        },
    });

    res.status(204).json({ status: 'success', data: null });
};


export const saveQuizResult = asAuth(async (req: AuthRequest, res: Response) => {

    const {points, totalQuestions} = req.body
    const quiz = req.params.id;
    const user = req.user._id;
    if (!quiz || !user) {
        return res.status(400).json({ status: 'fail', message: 'Missing quiz or user ID' });
    }

    const existing = await TestResult.findOne({ quiz, user});
    if (existing) {
        if (canRetakeQuiz(req.user.role)) {
            existing.points = points;
            existing.totalQuestions = totalQuestions;
            existing.date = new Date();
            await existing.save();

            return res.status(200).json({
                status: 'success',
                data: {
                    testResult: existing
                },
            });
        }

        return res.status(400).json({
            status: 'fail',
            message: 'Result already exists for this quiz and user.',
        });
    }

    const testResult = await TestResult.create({
            quiz,
            user,
            points,
            totalQuestions,
        });

    res.status(201).json({
        status: 'success',
        data: {
            testResult
        },
    });
});
