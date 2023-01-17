/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { app } from "../../../../../shared/infra/http/app";

describe("TEXTUAL GENRE - Delete TextualGenres of Article Controller", () => {
    let token;
    let admin;
    let textualGenre1;
    let textualGenre2;

    beforeAll(async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });
        admin = responseToken.body.user.id;
        token = responseToken.body.token;

        textualGenre1 = await request(app)
            .post("/textualgenre")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test",
            });

        textualGenre2 = await request(app)
            .post("/textualgenre")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test 2",
            });
    });

    it("Should be able to delete all textualGenres of an article", async () => {
        const article = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Essa é uma notícia",
                subTitle: "a cruz de malta é meu pendão",
                content: "tu tens o nome do heroico portugues",
                isHighlight: false,
                authors: [admin],
                courses: [],
                classes: [],
                textualGenres: [
                    textualGenre1.body.textualGenre.id,
                    textualGenre2.body.textualGenre.id,
                ],
            });

        const textualGenresDeleted = await request(app)
            .patch("/textualgenre/deletealltextualgenres")
            .set({ Authorization: `Bearer ${token}` })
            .send({ articleId: article.body.articleWithRelations.id });

        const articleWithTextualGenreDeleted = await request(app)
            .get(`/articles/${article.body.articleWithRelations.id}`)
            .set({ Authorization: `Bearer ${token}` });

        expect(
            article.body.articleWithRelations.TextualGenreOnArticles
        ).toHaveLength(2);

        expect(
            articleWithTextualGenreDeleted.body.TextualGenreOnArticles
        ).toHaveLength(0);
    });

    it("Should not able to delete all textualGenres of an article if the token is invalid", async () => {
        const article = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Essa é uma notícia",
                subTitle: "a cruz de malta é meu pendão",
                content: "tu tens o nome do heroico portugues",
                isHighlight: false,
                authors: [admin],
                courses: [],
                classes: [],
                textualGenres: [
                    textualGenre1.body.textualGenre.id,
                    textualGenre2.body.textualGenre.id,
                ],
            });

        const textualGenresDeleted = await request(app)
            .patch("/textualgenre/deletealltextualGenres")
            .set({ Authorization: `1111` })
            .send({ articleId: article.body.articleWithRelations.id });

        expect(textualGenresDeleted.body.message).toBe("Invalid Token");
    });

    it("Should not able to delete all textualGenres of an article if user is not logged", async () => {
        const article = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Essa é uma notícia",
                subTitle: "a cruz de malta é meu pendão",
                content: "tu tens o nome do heroico portugues",
                isHighlight: false,
                authors: [admin],
                courses: [],
                classes: [],
                textualGenres: [
                    textualGenre1.body.textualGenre.id,
                    textualGenre2.body.textualGenre.id,
                ],
            });

        const textualGenresDeleted = await request(app)
            .patch("/textualgenre/deletealltextualgenres")
            .send({ articleId: article.body.articleWithRelations.id });

        expect(textualGenresDeleted.body.message).toBe("Token missing");
    });
});
