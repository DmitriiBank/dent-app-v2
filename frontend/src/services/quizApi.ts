import {httpRequest} from "./http.ts";
import type {Quiz, SaveResultResponse} from "../types/quiz-types.ts";
import type { Question } from "../types/quiz-types.ts";
import { canRetakeTests } from "../utils/permissions.ts";

export const getAllQuizzes = async () => {
    const res = await httpRequest<{ data: Quiz[] }>(`/api/v1/quizzes`, { auth: false });
    return res.data;
};

export const getQuiz = async (id: string) => {
    const res = await httpRequest<{ data: Quiz }>(`/api/v1/quizzes/${id}`,{
        method: "GET",
        credentials: "include"
    });
    return res.data;
};

export function canTakeTest(
    quizId: string,
    userTestResults: Array<{ quiz: string ; score?: number }> = [],
    role?: string
): boolean {
    if (canRetakeTests(role)) {
        return true;
    }

    const alreadyTaken = userTestResults.some(r => String((r).quiz?? r.quiz) === quizId);
    return !alreadyTaken;
}

export async function saveTestResult(quizId: string, points: number, totalQuestions: number) {
    // localStorage.setItem("forceRefreshTests", "true");
    const res = await httpRequest<SaveResultResponse>(`/api/v1/quizzes/${quizId}/results`, {
        method: "POST",
        json: {points, totalQuestions},
        credentials: "include"
    });
    return res.data;
}

export async function createQuiz(data: Pick<Quiz, "title" | "description" | "icon">) {
    const res = await httpRequest<{ data: Quiz }>(`/api/v1/quizzes`, {
        method: "POST",
        json: data,
        credentials: "include",
    });
    return res.data;
}

export async function updateQuizData(quizId: string, data: Pick<Quiz, "title" | "description" | "icon">) {
    const res = await httpRequest<{ data: Quiz }>(`/api/v1/quizzes/${quizId}`, {
        method: "PATCH",
        json: data,
        credentials: "include",
    });
    return res.data;
}

export async function deleteQuizData(quizId: string) {
    await httpRequest(`/api/v1/quizzes/${quizId}`, {
        method: "DELETE",
        credentials: "include",
    });
}

export async function getQuizQuestions(quizId: string) {
    const res = await httpRequest<{ data: { questions: Question[] } }>(`/api/v1/quizzes/${quizId}/questions`, {
        method: "GET",
        credentials: "include",
    });
    return res.data.questions;
}

export async function createQuizQuestion(
    quizId: string,
    data: Pick<Question, "question" | "options" | "answer" | "image">
) {
    const res = await httpRequest<{ data: Question }>(`/api/v1/quizzes/${quizId}/questions`, {
        method: "POST",
        json: {
            ...data,
            quiz: quizId,
        },
        credentials: "include",
    });
    return res.data;
}

export async function updateQuizQuestion(
    quizId: string,
    questionId: string,
    data: Pick<Question, "question" | "options" | "answer" | "image">
) {
    const res = await httpRequest<{ data: Question }>(`/api/v1/quizzes/${quizId}/questions/${questionId}`, {
        method: "PATCH",
        json: data,
        credentials: "include",
    });
    return res.data;
}

export async function deleteQuizQuestion(quizId: string, questionId: string) {
    await httpRequest(`/api/v1/quizzes/${quizId}/questions/${questionId}`, {
        method: "DELETE",
        credentials: "include",
    });
}
