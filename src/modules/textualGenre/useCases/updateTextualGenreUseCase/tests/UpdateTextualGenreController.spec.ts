/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { AppError } from "../../../../../shared/errors/AppError";
import { app } from "../../../../../shared/infra/http/app";

describe("Update TextualGenre Controller", () => {
    let token: string;

    beforeAll(async () => {
        const loginAdmin = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        token = loginAdmin.body.token;
    });

    it("Should be able to update a new textualGenre", async () => {
        const response = await request(app)
            .post("/textualgenre")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Genero 1",
            });

        expect(response.body.textualGenre.name).toBe("Teste De Genero 1");

        const update = await request(app)
            .put(`/textualgenre/${response.body.textualGenre.id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Genero 2",
            });

        expect(update.body.textualGenre.name).toBe("Teste De Genero 2");
    });

    it("Should not be able to update a new textualGenre with same name", async () => {
        const response = await request(app)
            .post("/textualgenre")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Genero 3",
            });

        const response2 = await request(app)
            .post("/textualgenre")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Genero 4",
            });

        expect(response.body.textualGenre.name).toBe("Teste De Genero 3");
        expect(response2.body.textualGenre.name).toBe("Teste De Genero 4");

        const update = await request(app)
            .put(`/textualgenre/${response2.body.textualGenre.id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Genero 3",
            });

        expect(update.body.message).toBe("Textual Genre already exists");
    });

    it("Should not be able to update a Textual Genre if user is not logged", async () => {
        const response2 = await request(app)
            .post("/textualgenre")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Genero 5",
            });

        const update = await request(app)
            .put(`/textualgenre/${response2.body.textualGenre.id}`)
            .send({
                name: "Teste De Genero 9",
            });

        expect(update.body.message).toBe("Token missing");
    });

    it("Should not be able to update a  textual genre if the token is invalid", async () => {
        const response2 = await request(app)
            .post("/textualgenre")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Genero 5",
            });

        const update = await request(app)
            .put(`/textualgenre/${response2.body.textualGenre.id}`)
            .set({ Authorization: `Bearer 1111` })
            .send({
                name: "Teste De Genero 9",
            });

        expect(update.body.message).toBe("Invalid Token");
    });
});
