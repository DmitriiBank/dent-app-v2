import fs from 'node:fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {QuizDbModel} from "../../schemas/quiz.schema";
import {Question} from "../../model/Quiz";
import {QuestionModel} from "../../schemas/question.schema";

const scriptDir = path.resolve(path.dirname(process.argv[1] ?? 'src/dev-data/data/import-dev-data.ts'));
const dataDir = scriptDir;

dotenv.config();
const database = process.env.DATABASE;
const databasePassword = process.env.DATABASE_PASSWORD;

if (!database) {
  throw new Error('DATABASE environment variable is required');
}

const DB = database.includes('<PASSWORD>')
    ? database.replace('<PASSWORD>', databasePassword ?? '')
    : database;

const quizzesPath = path.join(dataDir, 'quizzes.json');
const questionsDir = path.join(dataDir, 'questions-data');

type ImportQuestion = Pick<Question, 'quiz' | 'question' | 'image' | 'options' | 'answer'>;

const quizzes = JSON.parse(fs.readFileSync(quizzesPath, 'utf-8'));


const questionFiles = fs
    .readdirSync(questionsDir)
    .filter((file) => file.startsWith('lesson') && file.endsWith('.json'));

const allQuestions: ImportQuestion[] = [];
const knownQuizIds = new Set(quizzes.map((quiz: {_id: string}) => String(quiz._id)));

for (const file of questionFiles) {
  const filePath = path.join(questionsDir, file);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (Array.isArray(content.questions)) {
    const quizId = String(content.quiz);
    if (!knownQuizIds.has(quizId)) {
      throw new Error(`Question file ${file} references unknown quiz ${quizId}`);
    }

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
    await QuestionModel.deleteMany();
    await QuizDbModel.deleteMany();

    await QuizDbModel.insertMany(quizzes);
    await QuestionModel.insertMany(allQuestions);

    console.log(`Imported ${quizzes.length} quizzes and ${allQuestions.length} questions`);
  } catch (err) {
    console.log(err);
  } finally {
    await mongoose.connection.close();
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
  } finally {
    await mongoose.connection.close();
  }
  process.exit();
};

const main = async () => {
  await mongoose.connect(DB);
  console.log('DB Connected');

  if (process.argv[2] === '--import') {
    await importData();
    return;
  }

  if (process.argv[2] === '--delete') {
    await deleteData();
    return;
  }

  console.log('Use --import or --delete');
  await mongoose.connection.close();
};

main().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close().catch(() => undefined);
  process.exit(1);
});
