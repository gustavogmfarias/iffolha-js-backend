/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { AppError } from "../../../../../shared/errors/AppError";
import { app } from "../../../../../shared/infra/http/app";

describe("Delete Tags of Article Controller", () => {
    let token;
    let admin;
    beforeAll(async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });
        admin = responseToken.body.user.id;
        token = responseToken.body.token;
    });

    it("Should be able to delete all tags of an article", async () => {
        const tag1 = await request(app)
            .post("/tags")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test",
            });

        const tag2 = await request(app)
            .post("/tags")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test 2",
            });

        const article = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Essa é uma notícia",
                subTitle: "a cruz de malta é meu pendão",
                content: "tu tens o nome do heroico portugues",
                isHighlight: false,
                authors: [admin],
                tags: ["test", "test 2"],
                courses: [],
                classes: [],
                categories: [],
                textualGenres: [],
            });

        const tagsDeleted = await request(app)
            .patch("/tags/deletealltags")
            .set({ Authorization: `Bearer ${token}` })
            .send({ articleId: article.body[0].id });

        setTimeout(
            () =>
                expect(tagsDeleted.body.articleEdited.TagsOnArticles).toBe(
                    null
                ),
            20000
        );
    });

    it("Should not able to delete all tags of an article if the token is invalid", async () => {
        const article = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Essa é uma notícia",
                subTitle: "a cruz de malta é meu pendão",
                content: "tu tens o nome do heroico portugues",
                isHighlight: false,
                authors: [admin],
                tags: ["test", "test 2"],
                courses: [],
                classes: [],
                categories: [],
                textualGenres: [],
            });

        const tagsDeleted = await request(app)
            .patch("/tags/deletealltags")
            .set({ Authorization: `1111` })
            .send({ articleId: article.body[0].id });

        expect(tagsDeleted.body.message).toBe("Invalid Token");
    });

    it("Should not able to delete all tags of an article if user is not logged", async () => {
        const article = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Essa é uma notícia",
                subTitle: "a cruz de malta é meu pendão",
                content: "tu tens o nome do heroico portugues",
                isHighlight: false,
                authors: [admin],
                tags: ["test", "test 2"],
                courses: [],
                classes: [],
                categories: [],
                textualGenres: [],
            });

        const tagsDeleted = await request(app)
            .patch("/tags/deletealltags")
            .send({ articleId: article.body[0].id });

        expect(tagsDeleted.body.message).toBe("Token missing");
    });
});
