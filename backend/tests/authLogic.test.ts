import { beforeAll, describe, expect, it, jest, afterEach } from '@jest/globals';
import type { Profile } from 'passport-google-oauth20';

process.env.NODE_ENV ??= 'test';
process.env.DATABASE ??= 'mongodb://localhost:27017/dent_app_test';
process.env.JWT_ACCESS_SECRET ??= 'test-access-secret';
process.env.JWT_REFRESH_SECRET ??= 'test-refresh-secret';

let UserDbModel: typeof import('../src/schemas/user.schema').UserDbModel;
let findOrCreateUser: typeof import('../src/config/passportConfig').findOrCreateUser;

beforeAll(async () => {
    ({ UserDbModel } = await import('../src/schemas/user.schema'));
    ({ findOrCreateUser } = await import('../src/config/passportConfig'));
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('User auth logic', () => {
    it('invalidates tokens issued before password change', () => {
        const user = new UserDbModel({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            passwordConfirm: 'password123',
        });

        user.passwordChangedAt = new Date('2026-01-01T00:00:10.000Z');

        expect(user.changedPasswordAfter(1767225605)).toBe(true);
        expect(user.changedPasswordAfter(1767225615)).toBe(false);
    });

    it('links a google profile to an existing user with the same email', async () => {
        const existingUser = new UserDbModel({
            name: 'Existing User',
            email: 'existing@example.com',
            password: 'password123',
            passwordConfirm: 'password123',
            provider: 'local',
        });
        const saveMock = jest.fn(async () => existingUser);
        existingUser.save = saveMock as typeof existingUser.save;

        jest.spyOn(UserDbModel, 'findOne')
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(existingUser);
        const createSpy = jest.spyOn(UserDbModel, 'create');

        const profile = {
            id: 'google-123',
            displayName: 'Existing User',
            emails: [{ value: 'existing@example.com', verified: true }],
            photos: [{ value: 'https://example.com/avatar.png' }],
        } as Profile;

        const result = await findOrCreateUser(profile);

        expect(result).toBe(existingUser);
        expect(existingUser.googleId).toBe('google-123');
        expect(existingUser.provider).toBe('local');
        expect(existingUser.avatar).toBe('https://example.com/avatar.png');
        expect(saveMock).toHaveBeenCalled();
        expect(createSpy).not.toHaveBeenCalled();
    });
});
