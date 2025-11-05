import { HttpError } from "../errorHandler/HttpError.js";
import { convertQuizDtoToQuiz } from "../utils/tools.js";
import { quizServiceMongo as service } from "../services/quizMongooseService.js";
import * as factory from "./HandlerFactory.js";
import { QuizDbModel } from "../validators/quiz.schema.js";
export class QuizController {
    // private lessonService: LibService = new LibServiceImplEmbedded();
    async getAllQuiz(req, res) {
        const result = await service.getAllQuiz();
        res.json(result);
    }
    async addQuiz(req, res) {
        const dto = req.body;
        const quiz = convertQuizDtoToQuiz(dto);
        const result = await service.addQuiz(quiz);
        if (result)
            res.status(201).json(quiz);
        else
            throw new HttpError(409, "Quiz not add");
    }
    async getQuizById(req, res) {
        const quizId = req.body.id;
        if (!quizId)
            throw new HttpError(400, "Invalid quiz ID");
        const founded = await service.getQuizById(quizId);
        if (founded !== null) {
            res.status(200).json(founded);
        }
        else {
            res.status(200).send('Quizs not found');
        }
    }
    async removeQuiz(req, res) {
        const quizId = req.body.id;
        if (!quizId)
            throw new HttpError(400, "Invalid quiz ID");
        const removed = await service.removeQuiz(quizId);
        if (removed) {
            res.status(200).json(removed);
        }
        else {
            res.status(200).send("Quiz not found");
        }
    }
    async saveQuizResult(req, res) {
        const { quizId, userId } = req.query;
        const { points, totalQuestions } = req.body;
        if (!quizId)
            throw new HttpError(400, "Quiz not found");
        if (!userId)
            throw new HttpError(400, "User not added");
        await service.saveQuizResult(quizId, userId, points, totalQuestions);
        res.status(200).json({ message: "Quiz finished" });
    }
}
export const updateQuiz = factory.updateOne(QuizDbModel);
