/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import { app } from "@shared/infra/http/app";
import request from "supertest";

describe("USER - User Profile Profile Controller", () => {
    it("Should be able to show the profile of a user logged", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });
        const { token } = responseToken.body;

        const response = await request(app)
            .get(`/users/profile`)
            .set({ Authorization: `Bearer ${token}` });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Admin");
    });

    it("Should not be able to show the profile of a user if you was not logged", async () => {
        const response = await request(app).get(`/users/profile`);
        expect(response.body.message).toBe("Token missing");
    });

    it("Should not be able to show the profile of a user if token was expired or invalid", async () => {
        const response = await request(app)
            .get(`/users/profile`)
            .set({ Authorization: `Bearer 111` });

        expect(response.body.message).toBe("Invalid Token");
    });
});
