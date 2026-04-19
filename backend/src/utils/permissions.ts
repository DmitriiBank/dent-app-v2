import { Roles } from "./quizTypes";

export const isAdminRole = (role?: string | null) => role === Roles.ADMIN;

export const isTeacherRole = (role?: string | null) => role === Roles.TEACHER;

export const isPrivilegedRole = (role?: string | null) =>
    role === Roles.ADMIN || role === Roles.TEACHER;

export const canRetakeQuiz = (role?: string | null) => isPrivilegedRole(role);
