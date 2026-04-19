import { describe, expect, it } from "@jest/globals";

import { canRetakeQuiz, isAdminRole, isPrivilegedRole, isTeacherRole } from "../src/utils/permissions";
import { Roles } from "../src/utils/quizTypes";

describe("permissions helpers", () => {
    it("detects admin role correctly", () => {
        expect(isAdminRole(Roles.ADMIN)).toBe(true);
        expect(isAdminRole(Roles.TEACHER)).toBe(false);
        expect(isAdminRole(undefined)).toBe(false);
    });

    it("detects teacher role correctly", () => {
        expect(isTeacherRole(Roles.TEACHER)).toBe(true);
        expect(isTeacherRole(Roles.USER)).toBe(false);
    });

    it("marks admin and teacher as privileged", () => {
        expect(isPrivilegedRole(Roles.ADMIN)).toBe(true);
        expect(isPrivilegedRole(Roles.TEACHER)).toBe(true);
        expect(isPrivilegedRole(Roles.USER)).toBe(false);
    });

    it("allows privileged roles to retake quizzes", () => {
        expect(canRetakeQuiz(Roles.ADMIN)).toBe(true);
        expect(canRetakeQuiz(Roles.TEACHER)).toBe(true);
        expect(canRetakeQuiz(Roles.USER)).toBe(false);
    });
});
