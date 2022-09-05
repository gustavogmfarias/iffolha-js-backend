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

    // it("usuário precisa estar com token válido para trocar a própria password", async () => {
    //     const response = await request(app)
    //         .patch("/usuários/change-password")
    //         .send({
    //             passwordAntiga: "gustavo",
    //             password: "gustavo",
    //             confirmapassword: "gustavo",
    //         })
    //         .set({ Authorization: `Bearer passwordErrada` });

    //     expect(response.body.message).toBe("Invalid Token");
    // });

    // it("usuário precisa estar logado para trocar a própria password", async () => {
    //     const response = await request(app)
    //         .patch("/usuários/change-password")
    //         .send({
    //             passwordAntiga: "gustavo",
    //             password: "gustavo",
    //             confirmapassword: "gustavo",
    //         });

    //     expect(response.body.message).toBe("Token missing");
    // });

    // it("Não alterar as passwords se a password anterior estiver errada", async () => {
    //     const responseToken = await request(app)
    //         .post("/sessions")
    //         .send({ email: "admin", password: "admin" });

    //     const { token } = responseToken.body;

    //     const response = await request(app)
    //         .patch("/usuários/change-password")
    //         .send({
    //             passwordAntiga: "passwordErrada",
    //             password: "gustavo",
    //             confirmapassword: "gustavo",
    //         })
    //         .set({ Authorization: `Bearer ${token}` });

    //     expect(response.body.message).toBe("Last Password doesn't match");
    // });

    // it("Não alterar as passwords se a nova password e confirmação de password não forem as mesmas", async () => {
    //     const responseToken = await request(app)
    //         .post("/sessions")
    //         .send({ email: "admin", password: "admin" });

    //     const { token } = responseToken.body;

    //     const response = await request(app)
    //         .patch("/usuários/change-password")
    //         .send({
    //             passwordAntiga: "admin",
    //             password: "gustavo",
    //             confirmapassword: "gustavopasswordErrada",
    //         })
    //         .set({ Authorization: `Bearer ${token}` });

    //     expect(response.body.message).toBe("Passwords don't match");
    // });
});
