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

        expect(response.body.tag.name).toBe("test");
        expect(response.body.log.description).toBe("Tag created successfully!");

        expect(response.status).toBe(201);
    });

    it("Should not be able to create a new tag if the token is invalid", async () => {
        const response = await request(app)
            .post("/tags")
            .set({ Authorization: `Bearer 111111` })
            .send({
                name: "test2",
            });

        expect(response.body.message).toBe("Invalid Token");
    });

    it("Should not be able to create a new tag if user is not logged", async () => {
        const response = await request(app).post("/tags").send({
            name: "test2",
        });

        expect(response.body.message).toBe("Token missing");
    });
});
