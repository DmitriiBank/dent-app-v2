// @ts-ignore
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../src/server';
import { QuizDbModel } from '../src/schemas/quiz.schema';
import { UserDbModel } from '../src/schemas/user.schema';
import { TestResult } from '../src/schemas/testResult.schema';

const app = createApp();
let token: string;
let quizId: string;
let userId: string;

describe('Quiz Result Integration Tests', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.DATABASE || 'mongodb://localhost:27017/quiz-app-test');
        
        // Create a user
        await UserDbModel.deleteMany({ email: 'resulttest@example.com' });
        const userRes = await request(app)
            .post('/api/v1/auth/signup')
            .send({
                name: 'Result Tester',
                email: 'resulttest@example.com',
                password: 'password123',
                passwordConfirm: 'password123'
            });
            
        userId = userRes.body.data._id;
        
        const cookies = userRes.headers['set-cookie'] as unknown as string[];
        if (cookies) {
            token = cookies.find((c: string) => c.startsWith('token')) || '';
        }

        // Create a quiz
        await QuizDbModel.deleteMany({ title: 'Result Test Quiz' });
        const quiz = await QuizDbModel.create({
            title: 'Result Test Quiz',
            description: 'A test quiz for results',
            questions: []
        });
        quizId = quiz._id.toString();
        
        // Clear previous results
        await TestResult.deleteMany({});
    }, 10000);

    afterAll(async () => {
        await UserDbModel.deleteMany({ email: 'resulttest@example.com' });
        await QuizDbModel.deleteMany({ title: 'Result Test Quiz' });
        await TestResult.deleteMany({});
        await mongoose.connection.close();
    });

    it('should save a test result successfully', async () => {
        const res = await request(app)
            .post(`/api/v1/quizzes/${quizId}/results`)
            .set('Cookie', [token])
            .send({
                points: 10,
                totalQuestions: 10
            });

        expect(res.status).toBe(201);
        expect(res.body.status).toBe('success');
        expect(res.body.data.testResult).toBeDefined();
        expect(res.body.data.testResult.points).toBe(10);
        expect(res.body.data.testResult.user).toBe(userId);
        expect(res.body.data.testResult.quiz).toBe(quizId);
    });

    it('should update existing result on duplicate submission', async () => {
        const res = await request(app)
            .post(`/api/v1/quizzes/${quizId}/results`)
            .set('Cookie', [token])
            .send({
                points: 5,
                totalQuestions: 10
            });

        expect(res.status).toBe(400);
        expect(res.body.status).toBe('fail');
        expect(res.body.message).toBe('Result already exists for this quiz and user.');
    });
});
