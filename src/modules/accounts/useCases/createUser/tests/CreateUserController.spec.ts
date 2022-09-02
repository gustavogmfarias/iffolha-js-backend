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

        const novoUserLogin = await request(app)
            .post("/sessions")
            .send({ email: "testIntegration@test.com.br", password: "test" });

        const log = response.body[1];

        expect(novoUserLogin.body).toHaveProperty("token");
        expect(log.description).toBe("User created successfully!");

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

        const { token } = responseToken.body;

        const userResponse = await request(app)
            .post("/users")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                email: "testIntegration@test2.com.br",
                name: "Test ",
                lastName: "Integration",
                password: "test",
            });

        expect(userResponse.body.message).toEqual("User is not an Admin!");
    });
});
