import { z } from "zod";
import { Roles } from "../utils/quizTypes";

export const updateMeSchema = z.object({
    body: z.object({
        name: z.string().trim().min(2).max(100).optional(),
        email: z.string().email().optional(),
    }),
});

export const adminCreateUserSchema = z.object({
    body: z.object({
        name: z.string().trim().min(2).max(100),
        email: z.string().email(),
        password: z.string().min(8),
        passwordConfirm: z.string().min(8),
        role: z.nativeEnum(Roles).optional(),
    }).refine((value) => value.password === value.passwordConfirm, {
        message: "Passwords must match",
        path: ["passwordConfirm"],
    }),
});

export const adminUpdateUserSchema = z.object({
    body: z.object({
        name: z.string().trim().min(2).max(100).optional(),
        email: z.string().email().optional(),
        role: z.nativeEnum(Roles).optional(),
        avatar: z.string().url().optional().or(z.literal("")),
    }).refine((value) => Object.keys(value).length > 0, {
        message: "At least one field is required",
        path: ["body"],
    }),
});
