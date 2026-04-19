import { Roles } from "../types/quiz-types.ts";

export const isAdmin = (role?: string | null) => role === Roles.ADMIN;

export const isTeacher = (role?: string | null) => role === Roles.TEACHER;

export const isPrivilegedUser = (role?: string | null) => isAdmin(role) || isTeacher(role);

export const canManageUsers = (role?: string | null) => isAdmin(role);

export const canManageContent = (role?: string | null) => isAdmin(role);

export const canViewStudentResults = (role?: string | null) => isPrivilegedUser(role);

export const canRetakeTests = (role?: string | null) => isPrivilegedUser(role);
