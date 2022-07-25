/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import { app } from "@shared/infra/http/app";
import request from "supertest";

describe("Create User Controller", () => {
    it("Should be able to create a new user", async () => {
        const response = await request(app).post("/users").send({
            email: "testIntegration@test.com.br",
            name: "Test ",
            lastName: "Integration",
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
    });

    it("Should not be able to create an existing user", async () => {
        await request(app).post("/users").send({
            email: "testIntegration@test.com.br",
            name: "Test ",
            lastName: "Integration",
        });

        const response = await request(app).post("/users").send({
            email: "testIntegration@test.com.br",
            name: "Test ",
            lastName: "Integration",
        });

        expect(response.status).toBe(400);
    });
});
