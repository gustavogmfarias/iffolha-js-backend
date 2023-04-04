/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import fs from "mz/fs";
import { app } from "../../../../../shared/infra/http/app";
import { AppError } from "../../../../../shared/errors/AppError";

let testFilePath = null;

describe("USER - Update Avatar User Controller", () => {
    it("Should be able to update a User's avatar", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const { token } = responseToken.body;

        const newUser = await request(app)
            .post("/users")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                email: "gustavo@test.com.br",
                name: "Gustavo",
                lastName: "Goulart",
                password: "test",
                role: "ADMIN",
            })
            .set({ Authorization: `Bearer ${token}` });

        let filePath = `${__dirname}/testFilePath.jpg`;
        let userUpdated;

        await fs.exists(filePath).then(async (exists) => {
            if (!exists) throw new AppError("file does not exist");

            userUpdated = await request(app)
                .patch(`/users/avatar/${newUser.body[0].id}`)
                .set({ Authorization: `Bearer ${token}` })
                .attach("avatar", filePath)
                .then((res) => {
                    const { success, message } = res.body;
                    filePath = res.body;
                    expect(success).toBeTruthy();
                    expect(message).toBe("Uploaded successfully");
                    expect(typeof filePath).toBeTruthy();

                    testFilePath = filePath;
                    const userUpdatedBody = userUpdated.body;
                    expect(userUpdated.status).toBe(200);
                    expect(userUpdatedBody.avatarUrl).not.toBe(null);
                })
                .catch((err) => console.log(err));
        });

        const userDeleted = await request(app)
            .delete(`/users/${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` });

        const userDeletedLogin = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@test.com.br", password: "test" });

        expect(userDeleted.body[1].description).toBe(
            "User successfully deleted!"
        );

        expect(userDeletedLogin.body.message).toBe(
            "Incorrect email or password!"
        );
    });

    it("Should not be able to update a User's avatar if not logged in", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const { token } = responseToken.body;

        const newUser = await request(app)
            .post("/users")
            .send({
                email: "gustavo@test.com.br",
                name: "Gustavo",
                lastName: "Goulart",
                password: "test",
                role: "ADMIN",
            })
            .set({ Authorization: `Bearer ${token}` });

        let filePath = `${__dirname}/testFilePath.jpg`;
        let userUpdated;

        await fs.exists(filePath).then(async (exists) => {
            if (!exists) throw new AppError("file does not exist");

            userUpdated = await request(app)
                .patch(`/users/avatar/${newUser.body[0].id}`)
                .attach("avatar", filePath)
                .then((res) => {
                    filePath = res.body;

                    testFilePath = filePath;
                    const userUpdatedBody = userUpdated.body;
                    expect(userUpdated.status).toBe(401);
                    expect(userUpdated.body.message).toBe("Token missing");
                })
                .catch((err) => console.log(err));
        });

        const userDeleted = await request(app)
            .delete(`/users/${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` });

        const userDeletedLogin = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@test.com.br", password: "test" });

        expect(userDeleted.body[1].description).toBe(
            "User successfully deleted!"
        );

        expect(userDeletedLogin.body.message).toBe(
            "Incorrect email or password!"
        );
    });

    it("Should not be able to update a User's avatar  if the token is invalid or expired", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const { token } = responseToken.body;

        const newUser = await request(app)
            .post("/users")
            .send({
                email: "gustavo@test.com.br",
                name: "Gustavo",
                lastName: "Goulart",
                password: "test",
                role: "ADMIN",
            })
            .set({ Authorization: `Bearer ${token}` });

        let filePath = `${__dirname}/testFilePath.jpg`;
        let userUpdated;

        await fs.exists(filePath).then(async (exists) => {
            if (!exists) throw new AppError("file does not exist");

            userUpdated = await request(app)
                .patch(`/users/avatar/${newUser.body[0].id}`)
                .attach("avatar", filePath)
                .set({ Authorization: `Bearer 1111` })
                .then((res) => {
                    filePath = res.body;

                    testFilePath = filePath;
                    const userUpdatedBody = userUpdated.body;
                    expect(userUpdated.status).toBe(401);
                    expect(userUpdated.body.message).toBe("Invalid Token");
                })
                .catch((err) => console.log(err));
        });

        const userDeleted = await request(app)
            .delete(`/users/${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` });

        const userDeletedLogin = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@test.com.br", password: "test" });

        expect(userDeleted.body[1].description).toBe(
            "User successfully deleted!"
        );

        expect(userDeletedLogin.body.message).toBe(
            "Incorrect email or password!"
        );
    });
});
