export enum Paths {
    LOGIN = "/users/login",
    GOOGLE = "/auth/success",
    PROFILE = "/profile",
    HOME = "/quizzes",
    QUIZ_RESULT = "/quizzes/:id/results",
    ERROR = "/error",
    LOGOUT = "/users/logout",
    REGISTER = '/users/signup',
    OPTIONS = '/options',
    LECTURES = '/lectures',
    ANATOMY = '/anatomy',
    MY_PAGE = "/users/me",
    ALL_USERS = "/users/users_list",
    RESTORE_PASS = "/users/forgotPassword",
    RESET_PASS = "/users/resetPassword/:token"
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


export interface Question {
    question: string;
    options: string[];
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
}