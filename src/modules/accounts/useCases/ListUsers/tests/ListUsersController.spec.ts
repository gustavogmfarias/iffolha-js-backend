/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import { app } from "../../../../../shared/infra/http/app";
import request from "supertest";

describe("USER - List Users Controller", () => {
    beforeAll(async () => {
        const loginAdmin = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const { token } = loginAdmin.body;

        const user1 = await request(app)
            .post("/users")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                email: "testIntegration@test.com.br",
                name: "Aa aa",
                lastName: "Integration",
                password: "test",
            });

        const user2 = await request(app)
            .post("/users")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                email: "testIntegration2@test.com.br",
                name: "Bb bb",
                lastName: "Integration",
                password: "test",
            });

        const user3 = await request(app)
            .post("/users")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                email: "testIntegration3@test.com.br",
                name: "Bb bb2",
                lastName: "Integration",
                password: "test",
            });

        const user4 = await request(app)
            .post("/users")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                email: "testIntegration4@test.com.br",
                name: "Cc cc",
                lastName: "Integration",
                password: "test",
            });
    });

    it("Should be able to list all users", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });
        const { token } = responseToken.body;

        const searchA = await request(app)
            .get(`/users?page&perPage&name`)
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(6);
        expect(searchA.body[0].name).toBe("Aa aa");
    });

    it("Should be able to list all users with pagination", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });
        const { token } = responseToken.body;

        const searchA = await request(app)
            .get(`/users?page=1&perPage=1&name`)
            .set({ Authorization: `Bearer ${token}` });

        const searchA2 = await request(app)
            .get(`/users?page=2&perPage=1&name`)
            .set({ Authorization: `Bearer ${token}` });

        const searchA6 = await request(app)
            .get(`/users?page=6&perPage=1&name`)
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(1);
        expect(searchA.body[0].name).toBe("Aa aa");
        expect(searchA2.body[0].name).toBe("Admin");
        expect(searchA6.body[0].name).toBe("Gustavo");
    });

    it("Should be able to list the users searching by name", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });
        const { token } = responseToken.body;

        const searchA = await request(app)
            .get(`/users?name=admin`)
            .set({ Authorization: `Bearer ${token}` });

        const searchA2 = await request(app)
            .get(`/users?name=g`)
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(1);
        expect(searchA2.body).toHaveLength(1);
    });

    it("Should not be able to list all users if you was not logged", async () => {
        const response = await request(app).get(`/users`);

        expect(response.body.message).toBe("Token missing");
    });

    it("Should not be able to list all users token was expired or invalid", async () => {
        const response = await request(app)
            .get(`/users`)
            .set({ Authorization: `Bearer 111` });

        expect(response.body.message).toBe("Invalid Token");
    });
});
