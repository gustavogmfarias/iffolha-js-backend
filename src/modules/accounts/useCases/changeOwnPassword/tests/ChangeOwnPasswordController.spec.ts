/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import { AppError } from "@shared/errors/AppError";
import { app } from "@shared/infra/http/app";
import { hash } from "bcryptjs";
import request from "supertest";

describe("Accounts - Change Own Password Controller", () => {
    it("Should be able to the user change its own password and generate a log", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const { token } = responseToken.body;

        const response = await request(app)
            .patch("/users/change-password")
            .send({
                previousPassword: "admin",
                newPassword: "newPassword",
                confirmNewPassword: "newPassword",
            })
            .set({ Authorization: `Bearer ${token}` });

        const responseLog = response.body[1];

        const loginNewPassword = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "newPassword" });

        expect(loginNewPassword.body).toHaveProperty("token");
        expect(responseLog.description).toBe(
            "User's password updated successfully!"
        );
        expect(response.status).toBe(200);
    });

    it("Should not be able to change the own passoword if the token is invalid", async () => {
        const response = await request(app)
            .patch("/users/change-password")
            .send({
                previousPassword: "gustavo",
                newPassword: "gustavo",
                confirmNewPassword: "gustavo",
            })
            .set({ Authorization: `Bearer 111` });

        expect(response.body.message).toBe("Invalid Token");
    });

    it("Should not be able to change the own passoword if user is not logged", async () => {
        const response = await request(app)
            .patch("/users/change-password")
            .send({
                previousPassword: "gustavo",
                newPassword: "gustavo",
                confirmNewPassword: "gustavo",
            });

        expect(response.body.message).toBe("Token missing");
    });

    it("Should not be able to change the own password if the previous password is wrong", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@gmail.com", password: "gustavo" });

        const { token } = responseToken.body;

        const response = await request(app)
            .patch("/users/change-password")
            .send({
                previousPassword: "wrongPassword",
                password: "gustavo",
                confirmNewPassword: "gustavo",
            })
            .set({ Authorization: `Bearer ${token}` });

        expect(response.body.message).toBe("Last Password doesn't match");
    });

    it("Should not be able to change the own password if the new password and the confirmNewPassword are not the same", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@gmail.com", password: "gustavo" });

        const { token } = responseToken.body;

        const response = await request(app)
            .patch("/users/change-password")
            .send({
                previousPassword: "gustavo",
                newPassword: "gustavo",
                confirmNewPassword: "gustavoWrongPassowrd",
            })
            .set({ Authorization: `Bearer ${token}` });

        expect(response.body.message).toBe("Passwords do not match!");
    });
});
