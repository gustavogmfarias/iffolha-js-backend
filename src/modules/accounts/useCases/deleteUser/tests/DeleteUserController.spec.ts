/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import { prisma } from "@shared/database/prismaClient";
import { AppError } from "@shared/errors/AppError";
import { app } from "@shared/infra/http/app";
import request from "supertest";

describe("Delete User Controller", () => {
    it("Should be able to delete a user and add a log", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const { token } = responseToken.body;

        const userCreated = await request(app)
            .post("/users")
            .send({
                name: "Fabiano",
                lastName: "Agape",
                email: "fabiano@gmail.com",
                password: "fabiano",
            })
            .set({ Authorization: `Bearer ${token}` });

        const responseDelete = await request(app)
            .delete(`/users/${userCreated.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` });

        const log = responseDelete.body[1];

        const userLogin = await request(app)
            .post("/sessions")
            .send({ email: "fabiano@gmail.com", password: "fabiano" });

        expect(log.description).toBe("User successfully deleted!");
        expect(userLogin.body.message).toBe("Incorrect email or password!");
        expect(userLogin.status).toBe(401);
        expect(responseDelete.status).toBe(200);
    });

    it("Should not be able to delete a user if you was not logged", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const { token } = responseToken.body;

        const userCreated = await request(app)
            .post("/users")
            .send({
                name: "Fabiano",
                lastName: "Agape",
                email: "fabiano@gmail.com",
                password: "fabiano",
            })
            .set({ Authorization: `Bearer ${token}` });

        const responseDelete = await request(app).delete(
            `/users/${userCreated.body[0].id}`
        );

        expect(responseDelete.body.message).toBe("Token missing");
    });

    it("Should not be able to delete a user if token is invalid or expired", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const { token } = responseToken.body;

        const userCreated = await request(app)
            .post("/users")
            .send({
                name: "Fabiano",
                lastName: "Agape",
                email: "fabiano2@gmail.com",
                password: "fabiano",
            })
            .set({ Authorization: `Bearer ${token}` });

        const responseDelete = await request(app)
            .delete(`/users/${userCreated.body[0].id}`)
            .set({ Authorization: `Bearer 1111` });

        expect(responseDelete.body.message).toBe("Invalid Token");
    });
});
