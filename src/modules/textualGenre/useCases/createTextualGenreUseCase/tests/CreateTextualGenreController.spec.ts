/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { AppError } from "../../../../../shared/errors/AppError";
import { app } from "../../../../../shared/infra/http/app";

describe("Create TextualGenre Controller", () => {
    let token: string;

    beforeAll(async () => {
        const loginAdmin = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        token = loginAdmin.body.token;
    });

    it("Should be able to create a new textualGenre", async () => {
        const response = await request(app)
            .post("/textualgenre")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Genero 1",
            });

        expect(response.body.textualGenre.name).toBe("Teste De Genero 1");
        expect(response.body.log.description).toBe(
            "Textual Genre created successfully!"
        );

        expect(response.status).toBe(201);
    });

    it("Should not be able to create a new textualGenre with same name", async () => {
        const response = await request(app)
            .post("/textualgenre")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Genero 1",
            });

        expect(response.body.message).toBe("Textual Genre already exists");
        expect(response.status).toBe(400);
    });

    it("Should not be able to create a new textualGenre if the token is invalid", async () => {
        const response = await request(app)
            .post("/textualgenre")
            .set({ Authorization: `Bearer 111111` })
            .send({
                name: "test2",
            });

        expect(response.body.message).toBe("Invalid Token");
    });

    it("Should not be able to create a new Textual Genre if user is not logged", async () => {
        const response = await request(app).post("/textualgenre").send({
            name: "test2",
        });

        expect(response.body.message).toBe("Token missing");
    });

    it("Should not be able to update a  textual genre if the token is invalid", async () => {
        const response2 = await request(app)
            .post("/textualgenre")
            .set({ Authorization: `Bearer 111` })
            .send({
                name: "Teste De Genero 5",
            });

        expect(response2.body.message).toBe("Invalid Token");
    });
});
