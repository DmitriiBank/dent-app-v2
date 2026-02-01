import { z } from "zod";

export const signupSchema = z.object({
    body: z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(8),
        passwordConfirm: z.string().min(8),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(1),
    }),
});

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email(),
    }),
});

export const resetPasswordSchema = z.object({
    params: z.object({
        token: z.string().min(1),
    }),
    body: z.object({
        password: z.string().min(8),
        passwordConfirm: z.string().min(8),
    }),
});

export const refreshSchema = z.object({
    body: z
        .object({
            refreshToken: z.string().min(1).optional(),
        })
        .passthrough(),
});

export const updatePasswordSchema = z.object({
    body: z.object({
        passwordCurrent: z.string().min(1),
        newPassword: z.string().min(8),
        newPasswordConfirm: z.string().min(8),
    }),
});
