/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import { AppError } from "@shared/errors/AppError";
import { app } from "@shared/infra/http/app";
import request from "supertest";

describe("Create User Controller", () => {
    it("Should be able to create a new user", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const { token } = responseToken.body;

        const response = await request(app)
            .post("/users")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                email: "testIntegration@test.com.br",
                name: "Test ",
                lastName: "Integration",
                password: "test",
            });

        expect(response.status).toBe(201);
    });

    it("Should not be able to create a new user with the same email", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const { token } = responseToken.body;

        const user = await request(app)
            .post("/users")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                email: "testIntegration@test.com.br",
                name: "Test ",
                lastName: "Integration",
                password: "test",
            });

        const userDuplicate = await request(app)
            .post("/users")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                email: "testIntegration@test.com.br",
                name: "Test ",
                lastName: "Integration",
                password: "test",
            });

        expect(userDuplicate.status).toBe(400);
    });

    it("Only admins should be able to include a new user", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@gmail.com", password: "gustavo" });
        // .send({ email: "admin@admin.com", password: "admin" });

        const { token } = responseToken.body;

        const userResponse = await request(app)
            .post("/users")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                email: "testIntegration@test.com.br",
                name: "Test ",
                lastName: "Integration",
                password: "test",
            });

        expect(userResponse).rejects.toEqual(
            new AppError("User is not an Admin!")
        );
    });
});
