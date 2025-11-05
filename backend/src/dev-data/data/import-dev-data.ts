import fs from 'node:fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {QuizDbModel} from "../../schemas/quiz.schema";
import {Question} from "../../model/Quiz";
import {QuestionModel} from "../../schemas/question.schema";

const __dirname = path.resolve();
// console.log(process.env)
dotenv.config();
const DB = process.env.DATABASE!.replace('<PASSWORD>', process.env.DATABASE_PASSWORD!);

(async () => {
  await mongoose.connect(DB).then(() => console.log('DB Connected'));
})();

const quizzesPath = path.join(__dirname, 'quizzes.json');
const questionsDir = path.join(__dirname, 'questions-data');

const quizzes = JSON.parse(fs.readFileSync(quizzesPath, 'utf-8'));


const questionFiles = fs
    .readdirSync(questionsDir)
    .filter((file) => file.startsWith('lesson') && file.endsWith('.json'));

const allQuestions: any[] = [];

for (const file of questionFiles) {
  const filePath = path.join(questionsDir, file);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (Array.isArray(content.questions)) {
    const quizId = content.quiz;
    const formattedQuestions = content.questions.map((q:  Question) => ({
      quiz: quizId,
      question: q.question,
      image: q.image ?? undefined,
      options: q.options,
      answer: q.answer,
    }));

    allQuestions.push(...formattedQuestions);
  } else {
    console.warn(`⚠️ File ${file} doesn't contain 'questions' array`);
  }
}


const importData = async () => {
  try {
    await QuizDbModel.create(quizzes);
    await QuestionModel.create(allQuestions);
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await QuizDbModel.deleteMany();
    await QuestionModel.deleteMany();

    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
