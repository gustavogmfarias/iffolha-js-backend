/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import { app } from "@shared/infra/http/app";
import request from "supertest";

describe("Authenticate User Controller", () => {
    it("Should be able to authenticate an user", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        expect(responseToken.body).toHaveProperty("token");
        expect(responseToken.body).toHaveProperty("refreshToken");
    });

    it("Should not be able to authenticate an inexistent user", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "testedeusuario", password: "testedeusuario" });

        expect(responseToken.body.message).toBe("Email or password incorrect");
    });

    it("Should not be able to authenticate if password doesn't match", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin", password: "amin1" });

        expect(responseToken.body.message).toBe("Email or password incorrect");
    });
});
