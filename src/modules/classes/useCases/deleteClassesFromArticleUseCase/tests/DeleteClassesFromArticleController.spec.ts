/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { app } from "../../../../../shared/infra/http/app";

describe("CLASSES - Delete Classes of Article Controller", () => {
    let token;
    let admin;
    let course1;
    let course2;
    let class1;
    let class2;

    beforeAll(async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });
        admin = responseToken.body.user.id;
        token = responseToken.body.token;

        course1 = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test",
                schoolLevel: "SUPERIOR",
            });

        course2 = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test 2",
                schoolLevel: "SUPERIOR",
            });

        class1 = await request(app)
            .post("/classes")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Class 1",
                courseId: course1.body.course.id,
            });

        class2 = await request(app)
            .post("/classes")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Class 2",
                courseId: course2.body.course.id,
            });
    });

    it("Should be able to delete all classes of an article", async () => {
        const article = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Essa é uma notícia",
                subTitle: "a cruz de malta é meu pendão",
                content: "tu tens o nome do heroico portugues",
                isHighlight: false,
                authors: [admin],
                classes: [class1.body.newClass.id, class2.body.newClass.id],
            });

        const classesDeleted = await request(app)
            .patch("/classes/deleteallclasses")
            .set({ Authorization: `Bearer ${token}` })
            .send({ articleId: article.body.articleWithRelations.id });

        const articleWithClassDeleted = await request(app)
            .get(`/articles/${article.body.articleWithRelations.id}`)
            .set({ Authorization: `Bearer ${token}` });

        expect(article.body.articleWithRelations.ClassOnArticles).toHaveLength(
            2
        );

        expect(articleWithClassDeleted.body.ClassesOnArticles).toHaveLength(0);
    });

    it("Should not able to delete all classes of an article if the token is invalid", async () => {
        const article = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Essa é uma notícia",
                subTitle: "a cruz de malta é meu pendão",
                content: "tu tens o nome do heroico portugues",
                isHighlight: false,
                authors: [admin],
                classes: [class1.body.newClass.id, class2.body.newClass.id],
            });

        const classesDeleted = await request(app)
            .patch("/classes/deleteallclasses")
            .set({ Authorization: `1111` })
            .send({ articleId: article.body.articleWithRelations.id });

        expect(classesDeleted.body.message).toBe("Invalid Token");
    });

    it("Should not able to delete all classes of an article if user is not logged", async () => {
        const article = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Essa é uma notícia",
                subTitle: "a cruz de malta é meu pendão",
                content: "tu tens o nome do heroico portugues",
                isHighlight: false,
                authors: [admin],
                classes: [class1.body.newClass.id, class2.body.newClass.id],
            });

        const classesDeleted = await request(app)
            .patch("/classes/deleteallclasses")
            .send({ articleId: article.body.articleWithRelations.id });

        expect(classesDeleted.body.message).toBe("Token missing");
    });
});
