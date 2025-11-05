"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveQuizResult = exports.addQuiz = exports.deleteQuiz = exports.updateQuiz = exports.getQuizById = exports.getAllQuizzes = void 0;
const factory = __importStar(require("./handlerFactory"));
const quiz_schema_1 = require("../schemas/quiz.schema");
const testResult_schema_1 = require("../schemas/testResult.schema");
exports.getAllQuizzes = factory.getAll(quiz_schema_1.QuizDbModel);
exports.getQuizById = factory.getOne(quiz_schema_1.QuizDbModel, { path: "questions" });
exports.updateQuiz = factory.updateOne(quiz_schema_1.QuizDbModel);
exports.deleteQuiz = factory.deleteOne(quiz_schema_1.QuizDbModel);
exports.addQuiz = factory.createOne(quiz_schema_1.QuizDbModel);
const saveQuizResult = async (req, res) => {
    const { points, totalQuestions } = req.body;
    const quiz = req.body.quiz || req.params.quizId;
    const user = req.body.user || req.user._id;
    if (!quiz || !user) {
        return res.status(400).json({ status: 'fail', message: 'Missing quiz or user ID' });
    }
    const existing = await testResult_schema_1.TestResult.findOne({ quiz, user });
    if (existing) {
        return res.status(400).json({
            status: 'fail',
            message: 'Result already exists for this quiz and user.',
        });
    }
    const testResult = await testResult_schema_1.TestResult.create({
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
};
exports.saveQuizResult = saveQuizResult;
