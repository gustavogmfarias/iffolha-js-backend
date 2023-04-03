/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { app } from "../../../../../shared/infra/http/app";

describe("ARTICLES - Find by ID Controller", () => {
    let token: string;

    beforeAll(async () => {
        const loginAdmin = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        token = loginAdmin.body.token;
    });

    it("Should be able to find an article by id", async () => {
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

        const response = await request(app)
            .get(`/articles/${novaNoticia.body.articleWithRelations.id}`)
            .set({ Authorization: `Bearer ${token}` });

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(novaNoticia.body.articleWithRelations.id);
    });

    it("Should not be able to find an article by id if you was not logged", async () => {
        const response = await request(app).get(`/articles/1111`);

        expect(response.body.message).toBe("Token missing");
    });

    it("Should not be able to find an article by id if token was expired or invalid", async () => {
        const response = await request(app)
            .get(`/articles/111`)
            .set({ Authorization: `Bearer 111` });

        expect(response.body.message).toBe("Invalid Token");
    });
});
