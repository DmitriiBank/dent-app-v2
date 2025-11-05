import { HttpError } from "../errorHandler/HttpError.js";
import { QuizDbModel } from "../validators/quiz.schema.js";
import { UserDbModel } from "../validators/user.schema.js";
import { Types } from "mongoose";
class QuizServiceImplMongo {
    async addQuiz(quiz) {
        await QuizDbModel.create(quiz);
        return Promise.resolve(true);
    }
    async removeQuiz(id) {
        const doc = await QuizDbModel.findByIdAndDelete(id).lean();
        if (!doc)
            throw new HttpError(404, `Quiz with id ${id} not found`);
        return doc;
    }
    async saveQuizResult(quizId, userId, points, totalQuestions) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new HttpError(400, `Invalid user id: ${userId}`);
        }
        if (!Types.ObjectId.isValid(quizId)) {
            throw new HttpError(400, `Invalid quiz id: ${quizId}`);
        }
        if (!Number.isFinite(points) || !Number.isFinite(totalQuestions) || totalQuestions <= 0 || points < 0) {
            throw new HttpError(400, "Invalid scoring payload");
        }
        const updatePath = `testList.${quizId}`; // динамический ключ в Map
        const res = await UserDbModel.updateOne({ _id: new Types.ObjectId(userId) }, {
            $set: {
                [updatePath]: {
                    points,
                    totalQuestions,
                }
            }
        });
        if (res.matchedCount === 0) {
            throw new HttpError(404, `User with id ${userId} not found`);
        }
    }
    async getAllQuiz() {
        return await QuizDbModel.find().sort({ createdAt: -1 });
    }
    async getQuizById(id) {
        const doc = await QuizDbModel.findById(id).populate('questions');
        if (!doc)
            throw new HttpError(404, `Quiz with id ${id} not found`);
        return doc;
    }
}
// ВАЖНО: экспортируем ИМЕННО экземпляр, а не класс:
export const quizServiceMongo = new QuizServiceImplMongo();
