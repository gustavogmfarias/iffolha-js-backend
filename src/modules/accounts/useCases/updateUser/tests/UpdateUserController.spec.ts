/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { app } from "../../../../../shared/infra/http/app";

jest.setTimeout(200000);

describe("USER - Update User Controller", () => {
    it("Should able to fully update a user", async () => {
        jest.setTimeout(200000);
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

        const newUserFoundById = await request(app)
            .get(`/users/findbyid?id=${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` });

        const newUserUpdated = await request(app)
            .patch(`/users/update/${newUser.body[0].id}`)
            .send({
                email: "tiago@test.com.br",
                name: "Tiago",
                lastName: "Mello",
                previousPassword: "test",
                newPassword: "tiago123",
                confirmNewPassword: "tiago123",
                role: "USER",
            })
            .set({ Authorization: `Bearer ${token}` });

        const newUserUpdatedFondById = await request(app)
            .get(`/users/findbyid?id=${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` });

        const newUserUpdatedToken = await request(app)
            .post("/sessions")
            .send({ email: "tiago@test.com.br", password: "tiago123" });

        const newUserTokenPreviousLoginAndPassword = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@test.com.br", password: "test" });

        const NewUserUpdatedLogBody = newUserUpdated.body[1];

        expect(NewUserUpdatedLogBody.description).toBe(
            "User successfully updated!"
        );
        expect(newUserFoundById.body.email).toBe("gustavo@test.com.br");
        expect(newUserFoundById.body.name).toBe("Gustavo");
        expect(newUserFoundById.body.lastName).toBe("Goulart");
        expect(newUserFoundById.body.role).toBe("ADMIN");
        expect(newUserUpdated.status).toBe(200);
        expect(newUserUpdatedFondById.body.email).toBe("tiago@test.com.br");
        expect(newUserUpdatedFondById.body.name).toBe("Tiago");
        expect(newUserUpdatedFondById.body.lastName).toBe("Mello");
        expect(newUserUpdatedFondById.body.role).toBe("USER");

        expect(newUserUpdatedToken.body).toHaveProperty("token");
        expect(newUserUpdatedToken.body).toHaveProperty("refreshToken");
        expect(newUserTokenPreviousLoginAndPassword.body.message).toBe(
            "Incorrect email or password!"
        );

        const userDeleted = await request(app)
            .delete(`/users/${newUserFoundById.body.id}`)
            .set({ Authorization: `Bearer ${token}` });

        const userDeletedLogin = await request(app)
            .post("/sessions")
            .send({ email: "tiago@test.com.br", password: "tiago123" });

        expect(userDeleted.body[1].description).toBe(
            "User successfully deleted!"
        );

        expect(userDeletedLogin.body.message).toBe(
            "Incorrect email or password!"
        );
    });

    it("Only administrators should be able to update a user", async () => {
        jest.setTimeout(200000);
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const { token } = responseToken.body;

        const userToken = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@gmail.com", password: "gustavo" });

        const { token: gustavoToken } = userToken.body;

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

        const newUserUpdated = await request(app)
            .patch(`/users/update/${newUser.body[0].id}`)
            .send({
                email: "tiago@test.com.br",
                name: "Tiago",
                lastName: "Mello",
                previousPassword: "test",
                newPassword: "tiago123",
                confirmNewPassword: "tiago123",
                role: "USER",
            })
            .set({ Authorization: `Bearer ${gustavoToken}` });

        const newUserUpdatedToken = await request(app)
            .post("/sessions")
            .send({ email: "tiago@test.com.br", password: "tiago123" });

        expect(newUserUpdated.status).toBe(400);
        expect(newUserUpdated.body.message).toBe("User is not an Admin!");

        expect(newUserUpdatedToken.status).toBe(401);
        expect(newUserUpdatedToken.body.message).toBe(
            "Incorrect email or password!"
        );

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

    it("Should be able to update only a user's e-mail", async () => {
        jest.setTimeout(200000);
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

        const newUserFoundById = await request(app)
            .get(`/users/findbyid?id=${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` });

        const newUserUpdated = await request(app)
            .patch(`/users/update/${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send({
                email: "tiago@test.com.br",
            });

        const newUserUpdatedFondById = await request(app)
            .get(`/users/findbyid?id=${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` });

        const newUserUpdatedToken = await request(app)
            .post("/sessions")
            .send({ email: "tiago@test.com.br", password: "test" });

        const newUserTokenPreviousLoginAndPassword = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@test.com.br", password: "test" });

        const NewUserUpdatedLogBody = newUserUpdated.body[1];

        expect(NewUserUpdatedLogBody.description).toBe(
            "User successfully updated!"
        );
        expect(newUserFoundById.body.email).toBe("gustavo@test.com.br");
        expect(newUserUpdated.status).toBe(200);
        expect(newUserUpdatedFondById.body.email).toBe("tiago@test.com.br");
        expect(newUserUpdatedFondById.body.name).toBe("Gustavo");
        expect(newUserUpdatedFondById.body.lastName).toBe("Goulart");
        expect(newUserUpdatedFondById.body.role).toBe("ADMIN");

        expect(newUserUpdatedToken.body).toHaveProperty("token");
        expect(newUserUpdatedToken.body).toHaveProperty("refreshToken");
        expect(newUserTokenPreviousLoginAndPassword.body.message).toBe(
            "Incorrect email or password!"
        );

        const userDeleted = await request(app)
            .delete(`/users/${newUserFoundById.body.id}`)
            .set({ Authorization: `Bearer ${token}` });

        const userDeletedLogin = await request(app)
            .post("/sessions")
            .send({ email: "tiago@test.com.br", password: "tiago123" });

        expect(userDeleted.body[1].description).toBe(
            "User successfully deleted!"
        );
        expect(userDeletedLogin.body.message).toBe(
            "Incorrect email or password!"
        );
    });

    it("Should be able to update only a user's password", async () => {
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

        const newUserFoundById = await request(app)
            .get(`/users/findbyid?id=${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` });

        const newUserUpdated = await request(app)
            .patch(`/users/update/${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send({
                previousPassword: "test",
                newPassword: "tiago123",
                confirmNewPassword: "tiago123",
            });

        const newUserUpdatedFondById = await request(app)
            .get(`/users/findbyid?id=${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` });

        const newUserUpdatedToken = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@test.com.br", password: "tiago123" });

        const newUserTokenPreviousLoginAndPassword = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@test.com.br", password: "test" });

        const NewUserUpdatedLogBody = newUserUpdated.body[1];

        expect(NewUserUpdatedLogBody.description).toBe(
            "User successfully updated!"
        );
        expect(newUserFoundById.body.email).toBe("gustavo@test.com.br");
        expect(newUserUpdated.status).toBe(200);
        expect(newUserUpdatedFondById.body.email).toBe("gustavo@test.com.br");
        expect(newUserUpdatedFondById.body.name).toBe("Gustavo");
        expect(newUserUpdatedFondById.body.lastName).toBe("Goulart");
        expect(newUserUpdatedFondById.body.role).toBe("ADMIN");

        expect(newUserUpdatedToken.body).toHaveProperty("token");
        expect(newUserUpdatedToken.body).toHaveProperty("refreshToken");
        expect(newUserTokenPreviousLoginAndPassword.body.message).toBe(
            "Incorrect email or password!"
        );

        const userDeleted = await request(app)
            .delete(`/users/${newUserFoundById.body.id}`)
            .set({ Authorization: `Bearer ${token}` });

        const userDeletedLogin = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@test.com.br", password: "tiago123" });

        expect(userDeleted.body[1].description).toBe(
            "User successfully deleted!"
        );
        expect(userDeletedLogin.body.message).toBe(
            "Incorrect email or password!"
        );
    });

    it("Should be able to update only a user's name", async () => {
        jest.setTimeout(200000);
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

        const newUserFoundById = await request(app)
            .get(`/users/findbyid?id=${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` });

        const newUserUpdated = await request(app)
            .patch(`/users/update/${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Tiago",
            });

        const newUserUpdatedFondById = await request(app)
            .get(`/users/findbyid?id=${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` });

        const newUserUpdatedToken = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@test.com.br", password: "test" });

        const NewUserUpdatedLogBody = newUserUpdated.body[1];

        expect(NewUserUpdatedLogBody.description).toBe(
            "User successfully updated!"
        );

        expect(newUserFoundById.body.name).toBe("Gustavo");
        expect(newUserUpdated.status).toBe(200);
        expect(newUserUpdatedFondById.body.email).toBe("gustavo@test.com.br");
        expect(newUserUpdatedFondById.body.name).toBe("Tiago");
        expect(newUserUpdatedFondById.body.lastName).toBe("Goulart");
        expect(newUserUpdatedFondById.body.role).toBe("ADMIN");

        expect(newUserUpdatedToken.body).toHaveProperty("token");
        expect(newUserUpdatedToken.body).toHaveProperty("refreshToken");

        const userDeleted = await request(app)
            .delete(`/users/${newUserFoundById.body.id}`)
            .set({ Authorization: `Bearer ${token}` });

        const userDeletedLogin = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@test.com.br", password: "tiago123" });

        expect(userDeleted.body[1].description).toBe(
            "User successfully deleted!"
        );
        expect(userDeletedLogin.body.message).toBe(
            "Incorrect email or password!"
        );
    });

    it("Should be able to update only a user's last name", async () => {
        jest.setTimeout(200000);
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

        const newUserFoundById = await request(app)
            .get(`/users/findbyid?id=${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` });

        const newUserUpdated = await request(app)
            .patch(`/users/update/${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send({
                lastName: "Mello",
            });

        const newUserUpdatedFondById = await request(app)
            .get(`/users/findbyid?id=${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` });

        const newUserUpdatedToken = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@test.com.br", password: "test" });

        const NewUserUpdatedLogBody = newUserUpdated.body[1];

        expect(NewUserUpdatedLogBody.description).toBe(
            "User successfully updated!"
        );

        expect(newUserFoundById.body.lastName).toBe("Goulart");
        expect(newUserUpdated.status).toBe(200);
        expect(newUserUpdatedFondById.body.email).toBe("gustavo@test.com.br");
        expect(newUserUpdatedFondById.body.name).toBe("Gustavo");
        expect(newUserUpdatedFondById.body.lastName).toBe("Mello");
        expect(newUserUpdatedFondById.body.role).toBe("ADMIN");

        expect(newUserUpdatedToken.body).toHaveProperty("token");
        expect(newUserUpdatedToken.body).toHaveProperty("refreshToken");

        const userDeleted = await request(app)
            .delete(`/users/${newUserFoundById.body.id}`)
            .set({ Authorization: `Bearer ${token}` });

        const userDeletedLogin = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@test.com.br", password: "tiago123" });

        expect(userDeleted.body[1].description).toBe(
            "User successfully deleted!"
        );
        expect(userDeletedLogin.body.message).toBe(
            "Incorrect email or password!"
        );
    });

    it("Should be able to update only a user's role", async () => {
        jest.setTimeout(200000);
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

        const newUserFoundById = await request(app)
            .get(`/users/findbyid?id=${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` });

        const newUserUpdated = await request(app)
            .patch(`/users/update/${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send({
                role: "USER",
            });

        const newUserUpdatedFondById = await request(app)
            .get(`/users/findbyid?id=${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` });

        const newUserUpdatedToken = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@test.com.br", password: "test" });

        const NewUserUpdatedLogBody = newUserUpdated.body[1];

        expect(NewUserUpdatedLogBody.description).toBe(
            "User successfully updated!"
        );

        expect(newUserFoundById.body.role).toBe("ADMIN");
        expect(newUserUpdated.status).toBe(200);
        expect(newUserUpdatedFondById.body.email).toBe("gustavo@test.com.br");
        expect(newUserUpdatedFondById.body.name).toBe("Gustavo");
        expect(newUserUpdatedFondById.body.lastName).toBe("Goulart");
        expect(newUserUpdatedFondById.body.role).toBe("USER");

        expect(newUserUpdatedToken.body).toHaveProperty("token");
        expect(newUserUpdatedToken.body).toHaveProperty("refreshToken");

        const userDeleted = await request(app)
            .delete(`/users/${newUserFoundById.body.id}`)
            .set({ Authorization: `Bearer ${token}` });

        const userDeletedLogin = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@test.com.br", password: "tiago123" });

        expect(userDeleted.body[1].description).toBe(
            "User successfully deleted!"
        );
        expect(userDeletedLogin.body.message).toBe(
            "Incorrect email or password!"
        );
    });

    it("Should not be able to update a user's password if the previous password is not correct", async () => {
        jest.setTimeout(200000);
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

        const newUserUpdated = await request(app)
            .patch(`/users/update/${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send({
                previousPassword: "testErrado",
                newPassword: "tiago123",
                confirmNewPassword: "tiago123",
            });

        const newUserUpdatedToken = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@test.com.br", password: "tiago123" });

        const newUserTokenPreviousLoginAndPassword = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@test.com.br", password: "test" });

        expect(newUserUpdated.body.message).toBe(
            "Previous password is not correct"
        );
        expect(newUserUpdated.status).toBe(401);

        expect(newUserTokenPreviousLoginAndPassword.body).toHaveProperty(
            "token"
        );
        expect(newUserTokenPreviousLoginAndPassword.body).toHaveProperty(
            "refreshToken"
        );
        expect(newUserUpdatedToken.body.message).toBe(
            "Incorrect email or password!"
        );

        const userDeleted = await request(app)
            .delete(`/users/${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` });

        const userDeletedLogin = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@test.com.br", password: "tiago123" });

        expect(userDeleted.body[1].description).toBe(
            "User successfully deleted!"
        );
        expect(userDeletedLogin.body.message).toBe(
            "Incorrect email or password!"
        );
    });

    it("Should not be able to update a user's password if the previous password and the new password do not match", async () => {
        jest.setTimeout(200000);
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

        const newUserUpdated = await request(app)
            .patch(`/users/update/${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send({
                previousPassword: "test",
                newPassword: "tiago123",
                confirmNewPassword: "tiago124",
            });

        const newUserUpdatedToken = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@test.com.br", password: "tiago123" });

        const newUserTokenPreviousLoginAndPassword = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@test.com.br", password: "test" });

        expect(newUserUpdated.body.message).toBe("Passwords do not match!");
        expect(newUserUpdated.status).toBe(401);

        expect(newUserTokenPreviousLoginAndPassword.body).toHaveProperty(
            "token"
        );
        expect(newUserTokenPreviousLoginAndPassword.body).toHaveProperty(
            "refreshToken"
        );
        expect(newUserUpdatedToken.body.message).toBe(
            "Incorrect email or password!"
        );

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

    it("Should not be able to update a user if the token is invalid or expired", async () => {
        jest.setTimeout(200000);
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

        const newUserUpdated = await request(app)
            .patch(`/users/update/${newUser.body[0].id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send({
                previousPassword: "test",
                newPassword: "tiago123",
                confirmNewPassword: "tiago124",
            })
            .set({ Authorization: `Bearer 1111` });

        expect(newUserUpdated.body.message).toBe("Invalid Token");

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

    it("Should not be able to update a user if not logged in", async () => {
        jest.setTimeout(200000);
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

        const newUserUpdated = await request(app)
            .patch(`/users/update/${newUser.body[0].id}`)
            .send({
                previousPassword: "test",
                newPassword: "tiago123",
                confirmNewPassword: "tiago123",
            });

        expect(newUserUpdated.body.message).toBe("Token missing");

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
