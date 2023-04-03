/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { advanceTo, clear } from "jest-date-mock";
import { app } from "../../../../../shared/infra/http/app";

describe("ARTICLES - List Articles Controller", () => {
    let token: string;

    beforeAll(async () => {
        const loginAdmin = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        token = loginAdmin.body.token;
    });

    it("Should be able to list all articles", async () => {
        // jest.setSystemTime(new Date("2023-01-01"));

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

    it("Should be able to list articles with pagination", async () => {
        // jest.setSystemTime(new Date("2023-01-01"));

        const novaNoticia = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Primeira notícia",
                subTitle: "Essa é a primeira notícia criada",
                content: "conteúdo da primeira notícia é",
                isHighlight: true,
            });

        const novaNoticia2 = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Segunda notícia",
                subTitle: "Essa é a segunda notícia criada",
                content: "conteúdo da segunda notícia é",
                isHighlight: true,
            });

        const novaNoticia3 = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Terceira notícia",
                subTitle: "Essa é a Terceira notícia criada",
                content: "conteúdo da Terceira notícia é",
                isHighlight: true,
            });
        const articles = await request(app)
            .get("/articles")
            .query({ page: 1, perPage: 2 })
            .set({ Authorization: `Bearer ${token}` });

        expect(articles.body).toHaveLength(2);
    });

    it("Should be able to list articles with title", async () => {
        jest.setSystemTime(new Date("2023-01-01"));

        const novaNoticia = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Primeira notícia",
                subTitle: "Essa é a primeira notícia criada",
                content: "conteúdo da primeira notícia é",
                isHighlight: true,
            });

        const novaNoticia2 = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Segunda notícia",
                subTitle: "Essa é a segunda notícia criada",
                content: "conteúdo da segunda notícia é",
                isHighlight: true,
            });

        const novaNoticia3 = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Terceira notícia",
                subTitle: "Essa é a Terceira notícia criada",
                content: "conteúdo da Terceira notícia é",
                isHighlight: true,
            });
        const articles = await request(app)
            .get("/articles")
            .query({ title: "Terceira" })
            .set({ Authorization: `Bearer ${token}` });

        expect(articles.body).toHaveLength(1);
    });

    it.skip("Should be able to list articles between dates", async () => {
        const dateToSimulate = new Date("2023-01-01T12:00:00.000Z");

        advanceTo(new Date("2023-01-01T12:00:00.000Z"));

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

        console.log(
            "novaNoticia :",
            novaNoticia.body.articleWithRelations.publishedDate
        );

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

        clear();

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

        console.log(
            "novaNoticia3: ",
            novaNoticia3.body.articleWithRelations.publishedDate
        );

        const articles = await request(app)
            .get("/articles")
            .query({ startDate: dateToSimulate, endDate: dateToSimulate })
            .set({ Authorization: `Bearer ${token}` });

        expect(articles.body).toHaveLength(2);
    });
});
