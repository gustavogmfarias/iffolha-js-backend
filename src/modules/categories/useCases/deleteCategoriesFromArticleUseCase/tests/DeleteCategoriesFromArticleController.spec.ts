/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { app } from "../../../../../shared/infra/http/app";

describe("Delete Categories of Article Controller", () => {
    let token;
    let admin;
    let category1;
    let category2;

    beforeAll(async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });
        admin = responseToken.body.user.id;
        token = responseToken.body.token;

        category1 = await request(app)
            .post("/categories")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test",
            });

        category2 = await request(app)
            .post("/categories")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test 2",
            });
    });

    it("Should be able to delete all categories of an article", async () => {
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
                categories: [
                    category1.body.category.id,
                    category2.body.category.id,
                ],
                textualGenres: [],
            });

        const categoriesDeleted = await request(app)
            .patch("/categories/deleteallcategories")
            .set({ Authorization: `Bearer ${token}` })
            .send({ articleId: article.body.articleWithRelations.id });

        const articleWithCategoryDeleted = await request(app)
            .get(`/articles/${article.body.articleWithRelations.id}`)
            .set({ Authorization: `Bearer ${token}` });

        console.log(
            "articleWithCategoryDeleted: ",
            articleWithCategoryDeleted.body
        );

        expect(
            article.body.articleWithRelations.CategoryOnArticles
        ).toHaveLength(2);

        expect(articleWithCategoryDeleted.body.CategoryOnArticles).toHaveLength(
            0
        );
    });

    it("Should not able to delete all categories of an article if the token is invalid", async () => {
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
                categories: [
                    category1.body.category.id,
                    category2.body.category.id,
                ],
                textualGenres: [],
            });

        const categoriesDeleted = await request(app)
            .patch("/categories/deleteallcategories")
            .set({ Authorization: `1111` })
            .send({ articleId: article.body.articleWithRelations.id });

        expect(categoriesDeleted.body.message).toBe("Invalid Token");
    });

    it("Should not able to delete all categories of an article if user is not logged", async () => {
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
                categories: [
                    category1.body.category.id,
                    category2.body.category.id,
                ],
                textualGenres: [],
            });

        const categoriesDeleted = await request(app)
            .patch("/categories/deleteallcategories")
            .send({ articleId: article.body.articleWithRelations.id });

        expect(categoriesDeleted.body.message).toBe("Token missing");
    });
});
