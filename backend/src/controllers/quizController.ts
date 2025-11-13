import {Response} from "express";
import * as factory from "./handlerFactory";
import {QuizDbModel} from "../schemas/quiz.schema";
import {TestResult} from "../schemas/testResult.schema";
import {AuthRequest} from "../utils/quizTypes";
import {asAuth} from "../utils/tools";


export const getAllQuizzes = factory.getAll(QuizDbModel);
export const getQuizById = factory.getOne(QuizDbModel, {path: "questions"})
export const updateQuiz = factory.updateOne(QuizDbModel)
export const deleteQuiz = factory.deleteOne(QuizDbModel)
export const addQuiz = factory.createOne(QuizDbModel)


export const saveQuizResult = asAuth(async (req: AuthRequest, res: Response) => {

    const {points, totalQuestions} = req.body
    // console.log(req.params, req.body)
    const quiz = req.body.quiz || req.params.id;
    const user = req.body.user || req.user._id;
    if (!quiz || !user) {
        return res.status(400).json({ status: 'fail', message: 'Missing quiz or user ID' });
    }

    const existing = await TestResult.findOne({ quiz, user});
    if (existing) {
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

