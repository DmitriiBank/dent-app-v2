
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
    testResults?: TestRecord[];
}

export interface TestRecord {
    quiz: string;
    title: string;
    points: number;
    totalQuestions: number;
}

// export const initialTests: TestRecord[] = [
//     {quiz: "lesson1", title: "Лекция 1", score: null, completed: false},
//     {quiz: "lesson2", title: "Лекция 2", score: null, completed: false},
//     {quiz: "lesson3", title: "Лекция 3", score: null, completed: false},
//     {quiz: "lesson4", title: "Лекция 4", score: null, completed: false},
//     {quiz: "lesson5", title: "Лекция 5", score: null, completed: false},
//     {quiz: "lesson6", title: "Лекция 6", score: null, completed: false},
//     {quiz: "lesson7", title: "Лекция 7", score: null, completed: false},
//     {quiz: "lesson8", title: "Лекция 8", score: null, completed: false},
// ];
