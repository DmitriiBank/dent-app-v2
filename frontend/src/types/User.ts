
export type UserDto = {
    first_name: string,
    last_name: string,
    email: string,
    password: string,
}
export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar: string | null;
    googleId?: string;
    provider?: string;
    testResults?: TestRecord[];
    passwordChangedAt?: string;
}

export interface TestRecord {
    quiz: string;
    user: string;
    points: number;
    totalQuestions: number;
}
