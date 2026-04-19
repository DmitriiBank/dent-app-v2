// @ts-ignore
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../src/server';
import { QuizDbModel } from '../src/schemas/quiz.schema';
import { UserDbModel } from '../src/schemas/user.schema';

const app = createApp();
let token: string;

describe('Quiz Integration Tests', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.DATABASE || 'mongodb://localhost:27017/quiz-app-test');
        
        // Create a user and get token
        await UserDbModel.deleteMany({ email: 'quiztest@example.com' });
        const userRes = await request(app)
            .post('/api/v1/auth/signup')
            .send({
                name: 'Quiz Tester',
                email: 'quiztest@example.com',
                password: 'password123',
                passwordConfirm: 'password123'
            });
        
        const cookies = userRes.headers['set-cookie'] as unknown as string[];
        if (cookies) {
            token = cookies.find((c: string) => c.startsWith('token=')) || '';
        }

        // Seed a quiz
        await QuizDbModel.deleteMany({ title: 'Test Quiz' });
        await QuizDbModel.create({
            title: 'Test Quiz',
            description: 'A test quiz',
            questions: []
        });
    }, 10000); // Increase timeout to 10s

    afterAll(async () => {
        await UserDbModel.deleteMany({ email: 'quiztest@example.com' });
        await QuizDbModel.deleteMany({ title: 'Test Quiz' });
        await mongoose.connection.close();
    });

    describe('GET /api/v1/quizzes', () => {
        it('should return all quizzes', async () => {
            const res = await request(app)
                .get('/api/v1/quizzes');

            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/v1/quizzes/:id', () => {
        it('should return a single quiz by ID', async () => {
            const quiz = await QuizDbModel.findOne({ title: 'Test Quiz' });
            const res = await request(app)
                .get(`/api/v1/quizzes/${quiz!._id}`);

            expect(res.status).toBe(200);
            expect(res.body.data.title).toBe('Test Quiz');
        });
    });
});
