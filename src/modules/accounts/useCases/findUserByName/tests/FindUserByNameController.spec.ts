/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import { app } from "@shared/infra/http/app";
import request from "supertest";

describe("USER - Find by Name Controller", () => {
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

    it("Should be able to find a user by Name", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });
        const { token } = responseToken.body;

        const searchA = await request(app)
            .get(`/users/findbyname?page&perPage&name=a`)
            .set({ Authorization: `Bearer ${token}` });

        const searchB = await request(app)
            .get(`/users/findbyname?page&perPage&name=b`)
            .set({ Authorization: `Bearer ${token}` });

        const searchC = await request(app)
            .get(`/users/findbyname?page&perPage&name=C`)
            .set({ Authorization: `Bearer ${token}` });

        expect(searchB.status).toBe(200);
        expect(searchA.body).toHaveLength(3);
        expect(searchB.body).toHaveLength(2);
        expect(searchC.body).toHaveLength(1);
    });

    it("Should be able to find a user by Name with pagination", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });
        const { token } = responseToken.body;

        const searchA = await request(app)
            .get(`/users/findbyname?page=1&perPage=1&name=a`)
            .set({ Authorization: `Bearer ${token}` });

        const searchB = await request(app)
            .get(`/users/findbyname?page=2&perPage=1&name=a`)
            .set({ Authorization: `Bearer ${token}` });

        const searchC = await request(app)
            .get(`/users/findbyname?page=3&perPage=1&name=a`)
            .set({ Authorization: `Bearer ${token}` });

        const searchD = await request(app)
            .get(`/users/findbyname?page=1&perPage=2&name=a`)
            .set({ Authorization: `Bearer ${token}` });

        const searchE = await request(app)
            .get(`/users/findbyname?page=2&perPage=2&name=a`)
            .set({ Authorization: `Bearer ${token}` });

        const searchF = await request(app)
            .get(`/users/findbyname?page=3&perPage=2&name=a`)
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(1);
        expect(searchA.body[0].name).toBe("Aa aa");
        expect(searchB.body).toHaveLength(1);
        expect(searchB.body[0].name).toBe("Admin");
        expect(searchC.body).toHaveLength(1);
        expect(searchC.body[0].name).toBe("Gustavo");
        expect(searchD.body).toHaveLength(2);
        expect(searchE.body).toHaveLength(1);
        expect(searchF.body).toHaveLength(0);
    });

    it("Should not be able to find a user by Name if you was not logged", async () => {
        const response = await request(app).get(
            `/users/findbyname?page&perPage&name=a`
        );

        expect(response.body.message).toBe("Token missing");
    });

    it("Should not be able to find a user by Name if token was expired or invalid", async () => {
        const response = await request(app)
            .get(`/users/findbyname?page&perPage&name=a`)
            .set({ Authorization: `Bearer 111` });

        expect(response.body.message).toBe("Invalid Token");
    });
});
