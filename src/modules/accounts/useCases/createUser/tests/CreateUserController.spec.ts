/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

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
            .send({
                email: "testIntegration@test.com.br",
                name: "Test ",
                lastName: "Integration",
                password: "test",
            })
            .set({ Authorization: `Bearer ${token}` });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");

        console.log("teste");
    });

    it("Should not be able to create an existing user", async () => {
        await request(app).post("/users").send({
            email: "testIntegration@test.com.br",
            name: "Test ",
            lastName: "Integration",
            password: "test",
        });

        const response = await request(app).post("/users").send({
            email: "testIntegration@test.com.br",
            name: "Test ",
            lastName: "Integration",
            password: "test",
        });

        expect(response.status).toBe(400);

        console.log("teste2");
    });
});
