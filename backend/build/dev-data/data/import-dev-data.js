"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const quiz_schema_1 = require("../../schemas/quiz.schema");
const question_schema_1 = require("../../schemas/question.schema");
const __dirname = path_1.default.resolve();
// console.log(process.env)
dotenv_1.default.config();
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
(async () => {
    await mongoose_1.default.connect(DB).then(() => console.log('DB Connected'));
})();
const quizzesPath = path_1.default.join(__dirname, 'quizzes.json');
const questionsDir = path_1.default.join(__dirname, 'questions-data');
const quizzes = JSON.parse(node_fs_1.default.readFileSync(quizzesPath, 'utf-8'));
const questionFiles = node_fs_1.default
    .readdirSync(questionsDir)
    .filter((file) => file.startsWith('lesson') && file.endsWith('.json'));
const allQuestions = [];
for (const file of questionFiles) {
    const filePath = path_1.default.join(questionsDir, file);
    const content = JSON.parse(node_fs_1.default.readFileSync(filePath, 'utf-8'));
    if (Array.isArray(content.questions)) {
        const quizId = content.quiz;
        const formattedQuestions = content.questions.map((q) => ({
            quiz: quizId,
            question: q.question,
            image: q.image ?? undefined,
            options: q.options,
            answer: q.answer,
        }));
        allQuestions.push(...formattedQuestions);
    }
    else {
        console.warn(`⚠️ File ${file} doesn't contain 'questions' array`);
    }
}
const importData = async () => {
    try {
        await quiz_schema_1.QuizDbModel.create(quizzes);
        await question_schema_1.QuestionModel.create(allQuestions);
        console.log('Data successfully loaded');
    }
    catch (err) {
        console.log(err);
    }
    process.exit();
};
const deleteData = async () => {
    try {
        await quiz_schema_1.QuizDbModel.deleteMany();
        await question_schema_1.QuestionModel.deleteMany();
        console.log('Data successfully deleted');
    }
    catch (err) {
        console.log(err);
    }
    process.exit();
};
if (process.argv[2] === '--import') {
    importData();
}
else if (process.argv[2] === '--delete') {
    deleteData();
}
console.log(process.argv);
