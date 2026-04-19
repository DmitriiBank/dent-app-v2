import { z } from "zod";

const ASSET_MAX_LENGTH = 5 * 1024 * 1024;

const assetSchema = z
    .string()
    .trim()
    .max(ASSET_MAX_LENGTH, "Asset string is too large")
    .refine(
        (value) =>
            value === "" ||
            /^(https?:\/\/|data:image\/|blob:|\/|[A-Za-z0-9._/-]+)/i.test(value),
        "Asset must be a URL, data image, blob URL, or local path"
    );

export const quizBodySchema = z.object({
    title: z.string().trim().min(3).max(120),
    description: z.string().trim().min(10).max(2000),
    icon: assetSchema.optional(),
});

export const quizSchema = z.object({
    body: quizBodySchema,
});

export const updateQuizSchema = z.object({
    body: quizBodySchema.partial().refine((value) => Object.keys(value).length > 0, {
        message: "At least one field is required",
        path: ["body"],
    }),
});

const questionBodySchema = z
    .object({
        quiz: z.string().trim().min(1).optional(),
        question: z.string().trim().min(5).max(2000),
        options: z.array(z.string().trim().min(1).max(500)).min(2).max(10),
        answer: z.number().int().min(0),
        image: assetSchema.optional(),
    })
    .superRefine((value, ctx) => {
        if (value.answer >= value.options.length) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["answer"],
                message: "Answer index must point to an existing option",
            });
        }
    });

export const createQuestionSchema = z.object({
    body: questionBodySchema,
    params: z.object({
        id: z.string().trim().min(1),
    }),
});

export const updateQuestionSchema = z.object({
    body: questionBodySchema.omit({ quiz: true }).partial().superRefine((value, ctx) => {
        if (Object.keys(value).length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["body"],
                message: "At least one field is required",
            });
        }

        if (
            typeof value.answer === "number" &&
            Array.isArray(value.options) &&
            value.answer >= value.options.length
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["answer"],
                message: "Answer index must point to an existing option",
            });
        }
    }),
    params: z.object({
        id: z.string().trim().min(1),
        questionId: z.string().trim().min(1),
    }),
});
