/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { AppError } from "../../../../../shared/errors/AppError";
import { app } from "../../../../../shared/infra/http/app";

describe("Delete Tags of Article Controller", () => {
    let token;
    let admin;
    let user;

    beforeAll(async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const responseToken2 = await request(app)
            .post("/sessions")
            .send({ email: "gustavo@gmail.com", password: "gustavo" });
        admin = responseToken.body.user.id;
        user = responseToken2.body.user.id;
        token = responseToken.body.token;
    });

    it("Should be able to delete all authors of an article", async () => {
        const article = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Essa é uma notícia",
                subTitle: "a cruz de malta é meu pendão",
                content: "tu tens o nome do heroico portugues",
                isHighlight: false,
                authors: [admin, user],
            });
        const articleFoundById = await request(app)
            .get(`/articles/${article.body.articleWithRelations.id}`)
            .set({ Authorization: `Bearer ${token}` });

        const authorsDeleted = await request(app)
            .patch("/articles/deleteallauthors")
            .set({ Authorization: `Bearer ${token}` })
            .send({ articleId: article.body.articleWithRelations.id });

        expect(articleFoundById.body.AuthorsOnArticles).toHaveLength(2);

        expect(
            authorsDeleted.body.articleEdited.AuthorsOnArticles
        ).toHaveLength(0);
    });

    it("Should not able to delete all authors of an article if the token is invalid", async () => {
        const article = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Essa é uma notícia",
                subTitle: "a cruz de malta é meu pendão",
                content: "tu tens o nome do heroico portugues",
                isHighlight: false,
                authors: [admin],
            });

        const authorsDeleted = await request(app)
            .patch("/articles/deleteallauthors")
            .set({ Authorization: `1111` })
            .send({ articleId: article.body.articleWithRelations.id });

        expect(authorsDeleted.body.message).toBe("Invalid Token");
    });

    it("Should not able to delete all authors of an article if user is not logged", async () => {
        const article = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Essa é uma notícia",
                subTitle: "a cruz de malta é meu pendão",
                content: "tu tens o nome do heroico portugues",
                isHighlight: false,
                authors: [admin],
            });

        const authorsDeleted = await request(app)
            .patch("/articles/deleteallauthors")
            .send({ articleId: article.body.articleWithRelations.id });

        expect(authorsDeleted.body.message).toBe("Token missing");
    });
});
