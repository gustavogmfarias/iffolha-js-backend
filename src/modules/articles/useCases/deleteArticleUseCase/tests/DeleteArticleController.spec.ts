/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import { prisma } from "@shared/database/prismaClient";
import request from "supertest";
import { AppError } from "../../../../../shared/errors/AppError";
import { app } from "../../../../../shared/infra/http/app";

describe("Delete User Controller", () => {
    let token: string;

    beforeAll(async () => {
        const loginAdmin = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        token = loginAdmin.body.token;
    });

    it("Should be able to delete a user and add a log", async () => {
        const novaNoticia = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Primeira notícia",
                subTitle: "Essa é a primeira notícia criada",
                content: "conteúdo da primeira notícia é",
                isHighlight: true,
                authors: [],
                tags: [],
                categories: [],
                textualGenres: [],
                courses: [],
                classes: [],
            });

        const articleDeleted = await request(app)
            .delete(`/articles/${novaNoticia.body.articleWithRelations.id}`)
            .set({ Authorization: `Bearer ${token}` });

        expect(articleDeleted.statusCode).toBe(200);
    });

    it("Should not be able to delete an article if you was not logged", async () => {
        const responseDelete = await request(app).delete(`/articles/1111`);

        expect(responseDelete.body.message).toBe("Token missing");
    });

    it("Should not be able to delete a user if token is invalid or expired", async () => {
        const responseDelete = await request(app)
            .delete(`/articles/1111`)
            .set({ Authorization: `Bearer 1111` });

        expect(responseDelete.body.message).toBe("Invalid Token");
    });
});
