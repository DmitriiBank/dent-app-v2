import { describe, expect, it } from "@jest/globals";

import {
    createQuestionSchema,
    quizSchema,
    updateQuestionSchema,
    updateQuizSchema,
} from "../src/validation/contentSchemas";

describe("content validation schemas", () => {
    it("accepts a valid quiz payload", () => {
        const parsed = quizSchema.parse({
            body: {
                title: "Dental Anatomy Basics",
                description: "A foundational quiz for dental anatomy and terminology.",
                icon: "https://example.com/icon.png",
            },
        });

        expect(parsed.body.title).toBe("Dental Anatomy Basics");
    });

    it("rejects an empty update quiz payload", () => {
        expect(() => updateQuizSchema.parse({ body: {} })).toThrow();
    });

    it("accepts a valid question payload", () => {
        const parsed = createQuestionSchema.parse({
            params: { id: "quiz-1" },
            body: {
                quiz: "quiz-1",
                question: "How many roots does this tooth usually have?",
                options: ["One", "Two", "Three"],
                answer: 1,
                image: "data:image/png;base64,abc123",
            },
        });

        expect(parsed.body.answer).toBe(1);
    });

    it("rejects a question when answer index is outside options", () => {
        expect(() =>
            createQuestionSchema.parse({
                params: { id: "quiz-1" },
                body: {
                    question: "Invalid question",
                    options: ["One", "Two"],
                    answer: 3,
                },
            })
        ).toThrow();
    });

    it("rejects an empty update question payload", () => {
        expect(() =>
            updateQuestionSchema.parse({
                params: { id: "quiz-1", questionId: "question-1" },
                body: {},
            })
        ).toThrow();
    });
});
