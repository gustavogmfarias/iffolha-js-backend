/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { AppError } from "../../../../../shared/errors/AppError";
import { app } from "../../../../../shared/infra/http/app";

describe("Create Tag Controller", () => {
    it("Should be able to create a new tag", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const { token } = responseToken.body;

        const response = await request(app)
            .post("/tags")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test",
            });

        console.log(response);

        expect(response.body.tag.name).toBe("test");
        expect(response.body.log.description).toBe("Tag created successfully!");

        expect(response.status).toBe(201);
    });

    // it("Should be able to create a new user and add a log with Admin role", async () => {
    //     const responseToken = await request(app)
    //         .post("/sessions")
    //         .send({ email: "admin@admin.com", password: "admin" });

    //     const { token } = responseToken.body;

    //     const response = await request(app)
    //         .post("/users")
    //         .set({ Authorization: `Bearer ${token}` })
    //         .send({
    //             email: "fabiano@test.com.br",
    //             name: "Fabiano ",
    //             lastName: "Agape",
    //             password: "fabiano",
    //             role: "ADMIN",
    //         });

    //     const novoUserLogin = await request(app)
    //         .post("/sessions")
    //         .send({ email: "testIntegration@test.com.br", password: "test" });

    //     const log = response.body[1];

    //     expect(response.body[0].role).toBe("ADMIN");
    //     expect(novoUserLogin.body).toHaveProperty("token");
    //     expect(log.description).toBe("User created successfully!");

    //     expect(response.status).toBe(201);
    // });

    // it("Should not be able to create a new user with nonexistent role", async () => {
    //     const responseToken = await request(app)
    //         .post("/sessions")
    //         .send({ email: "admin@admin.com", password: "admin" });

    //     const { token } = responseToken.body;

    //     const response = await request(app)
    //         .post("/users")
    //         .set({ Authorization: `Bearer ${token}` })
    //         .send({
    //             email: "fabianoRole@test.com.br",
    //             name: "Fabiano ",
    //             lastName: "Agape",
    //             password: "fabiano",
    //             role: "doesn't exist",
    //         });

    //     expect(response.status).toBe(400);
    //     expect(response.body.message).toBe("Role doesn't exist");
    // });

    // it("Should not be able to create a new user with the same email", async () => {
    //     const responseToken = await request(app)
    //         .post("/sessions")
    //         .send({ email: "admin@admin.com", password: "admin" });

    //     const { token } = responseToken.body;

    //     const user = await request(app)
    //         .post("/users")
    //         .set({ Authorization: `Bearer ${token}` })
    //         .send({
    //             email: "testIntegration2@test.com.br",
    //             name: "Test ",
    //             lastName: "Integration",
    //             password: "test",
    //         });

    //     const userDuplicate = await request(app)
    //         .post("/users")
    //         .set({ Authorization: `Bearer ${token}` })
    //         .send({
    //             email: "testIntegration2@test.com.br",
    //             name: "Test ",
    //             lastName: "Integration",
    //             password: "test",
    //         });

    //     expect(userDuplicate.status).toBe(400);
    //     expect(userDuplicate.body.message).toBe("User already exists");
    // });

    // it("Only admins should be able to include a new user", async () => {
    //     const responseToken = await request(app)
    //         .post("/sessions")
    //         .send({ email: "gustavo@gmail.com", password: "gustavo" });

    //     const { token } = responseToken.body;

    //     const userResponse = await request(app)
    //         .post("/users")
    //         .set({ Authorization: `Bearer ${token}` })
    //         .send({
    //             email: "testIntegration@test2.com.br",
    //             name: "Test ",
    //             lastName: "Integration",
    //             password: "test",
    //         });

    //     expect(userResponse.body.message).toEqual("User is not an Admin!");
    // });

    // it("Should not be able to create a new user without a Name ", async () => {
    //     const responseToken = await request(app)
    //         .post("/sessions")
    //         .send({ email: "admin@admin.com", password: "admin" });

    //     const { token } = responseToken.body;
    //     const userResponse = await request(app)
    //         .post("/users")
    //         .set({ Authorization: `Bearer ${token}` })
    //         .send({
    //             email: "testIntegration@test3.com.br",
    //             lastName: "Integration",
    //             password: "test",
    //         });
    //     expect(userResponse.status).toBe(400);
    // });

    // it("Should not be able to create a new user without a Last Name ", async () => {
    //     const responseToken = await request(app)
    //         .post("/sessions")
    //         .send({ email: "admin@admin.com", password: "admin" });
    //     const { token } = responseToken.body;

    //     const userResponse = await request(app)
    //         .post("/users")
    //         .set({ Authorization: `Bearer ${token}` })
    //         .send({
    //             email: "testIntegration@test4.com.br",
    //             name: "Test",
    //             password: "test",
    //         });

    //     expect(userResponse.status).toBe(400);
    // });

    // it("Should not be able to create a new user without a email ", async () => {
    //     const responseToken = await request(app)
    //         .post("/sessions")
    //         .send({ email: "admin@admin.com", password: "admin" });

    //     const { token } = responseToken.body;

    //     const userResponse = await request(app)
    //         .post("/users")
    //         .set({ Authorization: `Bearer ${token}` })
    //         .send({
    //             name: "Test",
    //             lastName: "Test",
    //             password: "test",
    //         });

    //     expect(userResponse.status).toBe(500);
    // });

    // it("Should not be able to create a new user without a password ", async () => {
    //     const responseToken = await request(app)
    //         .post("/sessions")
    //         .send({ email: "gustavo@gmail.com", password: "gustavo" });

    //     const { token } = responseToken.body;

    //     const userResponse = await request(app)
    //         .post("/users")
    //         .set({ Authorization: `Bearer ${token}` })
    //         .send({
    //             name: "Test",
    //             email: "a@a.com",
    //             lastName: "Test",
    //         });

    //     expect(userResponse.status).toBe(400);
    // });

    // it("Should not be able to create a new user if the token is invalid", async () => {
    //     const response = await request(app)
    //         .post("/users")
    //         .send({
    //             email: "testIntegration2@test.com.br",
    //             name: "Test ",
    //             lastName: "Integration",
    //             password: "test",
    //         })
    //         .set({ Authorization: `Bearer 111` });

    //     expect(response.body.message).toBe("Invalid Token");
    // });

    // it("Should not be able to create a new user if user is not logged", async () => {
    //     const response = await request(app).post("/users").send({
    //         email: "testIntegration2@test.com.br",
    //         name: "Test ",
    //         lastName: "Integration",
    //         password: "test",
    //     });

    //     expect(response.body.message).toBe("Token missing");
    // });
});
