import { describe, expect, it } from "@jest/globals";
import request from "supertest";

process.env.NODE_ENV ??= "test";
process.env.PORT ??= "3555";
process.env.DATABASE ??= "mongodb://localhost:27017/dent_app_test";
process.env.JWT_ACCESS_SECRET ??= "test-access-secret";
process.env.JWT_REFRESH_SECRET ??= "test-refresh-secret";

describe("App (e2e)", () => {
    it("responds to the health check route", async () => {
        const { createApp } = await import("../../src/server");
        const app = createApp();

        const response = await request(app).get("/");

        expect(response.status).toBe(200);
        expect(response.text).toContain("API is running");
    });
});
