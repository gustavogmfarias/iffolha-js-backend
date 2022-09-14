/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import { prisma } from "@shared/database/prismaClient";
import { AppError } from "@shared/errors/AppError";
import { app } from "@shared/infra/http/app";
import request from "supertest";

describe("Create User Controller", () => {
    it("Should be able to delete a user and add a log", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const { token } = responseToken.body;

        const userCreated = await request(app)
            .post("/users")
            .send({
                name: "Fabiano",
                lestName: "Agape",
                username: "fabiano",
                senha: "fabiano",
            })
            .set({ Authorization: `Bearer ${token}` });

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
                email: "testIntegration2@test.com.br",
                name: "Test ",
                lastName: "Integration",
                password: "test",
            });

        const userDuplicate = await request(app)
            .post("/users")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                email: "testIntegration2@test.com.br",
                name: "Test ",
                lastName: "Integration",
                password: "test",
            });

        expect(userDuplicate.status).toBe(400);
        expect(userDuplicate.body.message).toBe("User already exists");
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

    it("Should not be able to create a new user without a Name ", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const { token } = responseToken.body;

        const userResponse = await request(app)
            .post("/users")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                email: "testIntegration@test2.com.br",
                lastName: "Integration",
                password: "test",
            });

        expect(userResponse.status).toBe(500);
    });

    it("Should not be able to create a new user without a Last Name ", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });
        const { token } = responseToken.body;

        const userResponse = await request(app)
            .post("/users")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                email: "testIntegration@test2.com.br",
                name: "Test",
                password: "test",
            });

        expect(userResponse.status).toBe(500);
    });

    it("Should not be able to create a new user without a email ", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const { token } = responseToken.body;

        const userResponse = await request(app)
            .post("/users")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Test",
                lastName: "Test",
                password: "test",
            });

        expect(userResponse.status).toBe(500);
    });

    it("Should not be able to create a new user without a password ", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@gmail.com", password: "gustavo" });

        const { token } = responseToken.body;

        const userResponse = await request(app)
            .post("/users")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Test",
                email: "a@a.com",
                lastName: "Test",
            });

        expect(userResponse.status).toBe(400);
    });

    it("Should not be able to create a new user if the token is invalid", async () => {
        const response = await request(app)
            .post("/users")
            .send({
                email: "testIntegration2@test.com.br",
                name: "Test ",
                lastName: "Integration",
                password: "test",
            })
            .set({ Authorization: `Bearer 111` });

        expect(response.body.message).toBe("Invalid Token");
    });

    it("Should not be able to create a new user if user is not logged", async () => {
        const response = await request(app).post("/users").send({
            email: "testIntegration2@test.com.br",
            name: "Test ",
            lastName: "Integration",
            password: "test",
        });

        expect(response.body.message).toBe("Token missing");
    });
});
