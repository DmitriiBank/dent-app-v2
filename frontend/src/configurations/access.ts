import { Roles } from "../types/quiz-types.ts";

export const accessGroups = {
    quizParticipants: [Roles.USER, Roles.TEACHER, Roles.ADMIN],
    resultViewers: [Roles.USER, Roles.TEACHER, Roles.ADMIN],
    adminOnly: [Roles.ADMIN],
    teacherOrAdmin: [Roles.TEACHER, Roles.ADMIN],
} as const;
