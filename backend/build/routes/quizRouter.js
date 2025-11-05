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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizRouter = void 0;
const express_1 = __importDefault(require("express"));
const authService = __importStar(require("../middleware/authMiddleware"));
const controller = __importStar(require("../controllers/quizController"));
const questionRouter_1 = require("./questionRouter");
const userController = __importStar(require("../controllers/userController"));
exports.quizRouter = express_1.default.Router();
exports.quizRouter
    .route('/')
    .get(controller.getAllQuizzes)
    .post(authService.protect, authService.restrictTo("admin"), controller.addQuiz);
exports.quizRouter.use('/:quizId/questions', questionRouter_1.questionRouter);
exports.quizRouter
    .route('/:quizId')
    .get(controller.getQuizById)
    .patch(authService.protect, authService.restrictTo("admin"), controller.updateQuiz)
    .delete(authService.protect, authService.restrictTo("admin"), controller.deleteQuiz)
    .post(authService.protect, userController.getMe, controller.saveQuizResult);
