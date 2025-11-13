
export enum Paths {
    LOGIN = "/users/login",
    GOOGLE = "/auth/success",
    HOME = "/quizzes",
    QUIZ_RESULT = "/quizzes/:id/results",
    ERROR = "/error",
    LOGOUT = "/logout",
    REGISTER = '/users/signup',
    OPTIONS = '/options',
    LECTURES = '/lectures',
    ANATOMY = '/anatomy',
    MY_PAGE = "users/me",
    ALL_USERS = "users/users_list",
}

export enum Roles {
    USER = 'user',
    ADMIN = 'admin',
    GUEST = 'guest'
}

export type RouteType = {
    path: Paths,
    title: string,
    role?: Roles
}

export type LoginData = {
    email: string,
    password: string,
}

export type SignupData = {
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    passwordConfirm?: string
}

export interface Question {
    question: string;
    options:  string[];
    answer: number;
    image?: string;
    iframe?: string;
}

export interface Quiz {
    id: string;
    title: string;
    description: string;
    icon?: string;
    questions?: Question[];
}

export interface SaveResultResponse {
    status: string;
    data: {
        testResult: {
            quiz: string;
            user: string;
            points: number;
            totalQuestions: number;
            _id: string;
        };
    };
};