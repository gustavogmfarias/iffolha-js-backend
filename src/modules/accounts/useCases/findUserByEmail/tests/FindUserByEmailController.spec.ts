/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import { app } from "@shared/infra/http/app";
import request from "supertest";

describe("USER - Find by Email Controller", () => {
    it("Should be able to find a user by email", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });
        const { token } = responseToken.body;

        const response = await request(app)
            .post(`/users/findbyemail`)
            .send({ email: "admin@admin.com" })
            .set({ Authorization: `Bearer ${token}` });

        const { email } = response.body.email;

        expect(response.status).toBe(200);
        expect(response.body.email).toBe("admin@admin.com");
    });

    it("Should not be able to find a user by email if you was not logged", async () => {
        const response = await request(app)
            .post(`/users/findbyemail`)
            .send({ email: "admin@admin.com" });

        expect(response.body.message).toBe("Token missing");
    });

    it("Should not be able to find a user by email if token was expired or invalid", async () => {
        const response = await request(app)
            .post(`/users/findbyemail`)
            .send({ email: "admin@admin.com" })
            .set({ Authorization: `Bearer 111` });

        expect(response.body.message).toBe("Invalid Token");
    });
});
