import {httpRequest} from "./http.ts";
import type {Quiz} from "../types/quiz-types.ts";

export const getAllQuizzes = async () => {
    const res = await httpRequest<{ data: Quiz[] }>(`/api/v1/quizzes`, { auth: false });
    return res.data;
};

export const getQuiz = async (id: string) => {
    const res = await httpRequest<{ data: Quiz }>(`/api/v1/quizzes/${id}`);
    return res.data;
};

export function canTakeTest(
    quizId: string,
    userTestResults: Array<{ quiz: string ; score?: number }> = []
): boolean {
    const alreadyTaken = userTestResults.some(r => String((r).quiz?? r.quiz) === quizId);
    return !alreadyTaken;
}

export async function saveTestResult(quizId: string, points: number, totalQuestions: number) {
    localStorage.setItem("forceRefreshTests", "true");
    return httpRequest(`/api/v1/quizzes/${quizId}/results`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({points, totalQuestions}),
    });
}
