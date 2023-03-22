/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { app } from "../../../../../shared/infra/http/app";

describe("ARTICLES - List Articles Controller", () => {
    let token;
    jest.setTimeout(1000000);

    beforeAll(async () => {
        const loginAdmin = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        token = loginAdmin.body.token;
    });

    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.useRealTimers();
    });

    it("Should be able to list all articles", async () => {
        jest.setSystemTime(new Date("2023-01-01"));

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

        const novaNoticia2 = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Segunda notícia",
                subTitle: "Essa é a segunda notícia criada",
                content: "conteúdo da segunda notícia é",
                isHighlight: true,
                authors: [],
                tags: [],
                categories: [],
                textualGenres: [],
                courses: [],
                classes: [],
            });

        const novaNoticia3 = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Terceira notícia",
                subTitle: "Essa é a Terceira notícia criada",
                content: "conteúdo da Terceira notícia é",
                isHighlight: true,
                authors: [],
                tags: [],
                categories: [],
                textualGenres: [],
                courses: [],
                classes: [],
            });
        const articles = await request(app)
            .get("/articles")
            .set({ Authorization: `Bearer ${token}` });

        expect(articles.body).toHaveLength(5); // 2 notícias vieram do seed
    });
});
