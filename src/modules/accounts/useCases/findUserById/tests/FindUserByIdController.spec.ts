/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import { app } from "../../../../../shared/infra/http/app";
import request from "supertest";

describe("USER - Find by ID Controller", () => {
    it("Should be able to find a user by id", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });
        const { token } = responseToken.body;

        const response = await request(app)
            .get(`/users/findbyid?id=${responseToken.body.user.id}`)
            .set({ Authorization: `Bearer ${token}` });

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(responseToken.body.user.id);
    });

    it("Should not be able to find a user by id if you was not logged", async () => {
        const response = await request(app).get(`/users/findbyid?id=111`);

        expect(response.body.message).toBe("Token missing");
    });

    it("Should not be able to find a user by id if token was expired or invalid", async () => {
        const response = await request(app)
            .get(`/users/findbyid?id=111`)
            .set({ Authorization: `Bearer 111` });

        expect(response.body.message).toBe("Invalid Token");
    });
});
