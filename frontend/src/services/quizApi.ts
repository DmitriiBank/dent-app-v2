import {API, authFetch} from "./authApi.ts";



export const getAllQuizzes = async () => {
    const res = await fetch(`${API}/api/v1/quizzes`);
    const data = await res.json();
    return data.data;
};

export const getQuiz = async (id: string) => {
    const token = localStorage.getItem('token');
    console.log(token);
    const res = await fetch(`${API}/api/v1/quizzes/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include', // если cookie используется
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Ошибка загрузки теста');
    }

    const data = await res.json();
    return data.data;
};


export function canTakeTest(
    quizId: string,
    userTestResults: Array<{ quiz: string ; score?: number }> = []
): boolean {
    const alreadyTaken = userTestResults.some(r => String((r).quiz?? r.quiz) === quizId);
    return !alreadyTaken;
}

export async function saveTestResult(quizId: string, points: number, totalQuestions: number) {
    // стандартный вариант: POST /attempt
    const token = localStorage.getItem('token');
    console.log(token);
    return authFetch(`/api/v1/quizzes/${quizId}/results`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        body: JSON.stringify({points, totalQuestions}),
    });
}
