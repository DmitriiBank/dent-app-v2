
import mongoose from 'mongoose';
import request from 'supertest';

import { UserDbModel } from '../src/schemas/user.schema';
import { createApp } from '../src/server';

const app = createApp();

describe('Auth Integration Tests', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.DATABASE_TEST || 'mongodb://localhost:27017/quiz-app-test');
    });

    afterAll(async () => {
        await UserDbModel.deleteMany({ email: 'test@example.com' });
        await mongoose.connection.close();
    });

    describe('POST /api/v1/users/signup', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/v1/auth/signup')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123',
                    passwordConfirm: 'password123'
                });

            expect(res.status).toBe(201);
            expect(res.body.status).toBe('success');
            // Token is now in cookies, not body
            const cookies = res.headers['set-cookie'] as unknown as string[];
            expect(cookies).toBeDefined();
            expect(cookies.some((c: string) => c.includes('token'))).toBe(true);
           expect(res.body.data.email).toBe('test@example.com');
        });

        it('should not register user with existing email', async () => {
            const res = await request(app)
                .post('/api/v1/auth/signup')
                .send({
                    name: 'Test User 2',
                    email: 'test@example.com',
                    password: 'password123',
                    passwordConfirm: 'password123'
                });

            expect(res.status).toBe(400); // Or 500 depending on error handling
        });
    });

    describe('POST /api/v1/users/login', () => {
        it('should login with correct credentials', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.status).toBe(200);
            const cookies = res.headers['set-cookie'] as unknown as string[];
            expect(cookies).toBeDefined();
            expect(cookies.some((c: string) => c.includes('token'))).toBe(true);
             });

        it('should fail with incorrect password', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(res.status).toBe(401);
        });
    });
});
