
export enum Paths {
    LOGIN = "/users/login",
    HOME = "/quizzes",
    ERROR = "/error",
    LOGOUT = "/logout",
    REGISTER = '/users/signup',
    OPTIONS = '/options',
    LECTURES = '/lectures'
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
