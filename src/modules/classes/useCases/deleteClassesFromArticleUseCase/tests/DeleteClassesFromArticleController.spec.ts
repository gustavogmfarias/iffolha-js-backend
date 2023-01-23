/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { app } from "../../../../../shared/infra/http/app";

describe("COURSES - Delete Courses of Article Controller", () => {
    let token;
    let admin;
    let course1;
    let course2;

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
    });

    it("Should be able to delete all courses of an article", async () => {
        const article = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Essa é uma notícia",
                subTitle: "a cruz de malta é meu pendão",
                content: "tu tens o nome do heroico portugues",
                isHighlight: false,
                authors: [admin],
                classes: [],
                courses: [course1.body.course.id, course2.body.course.id],
            });

        const coursesDeleted = await request(app)
            .patch("/courses/deleteallcourses")
            .set({ Authorization: `Bearer ${token}` })
            .send({ articleId: article.body.articleWithRelations.id });

        const articleWithCourseDeleted = await request(app)
            .get(`/articles/${article.body.articleWithRelations.id}`)
            .set({ Authorization: `Bearer ${token}` });

        expect(
            article.body.articleWithRelations.CoursesOnArticles
        ).toHaveLength(2);

        expect(articleWithCourseDeleted.body.CoursesOnArticles).toHaveLength(0);
    });

    it("Should not able to delete all courses of an article if the token is invalid", async () => {
        const article = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Essa é uma notícia",
                subTitle: "a cruz de malta é meu pendão",
                content: "tu tens o nome do heroico portugues",
                isHighlight: false,
                authors: [admin],
                classes: [],
                courses: [course1.body.course.id, course2.body.course.id],
            });

        const coursesDeleted = await request(app)
            .patch("/courses/deleteallcourses")
            .set({ Authorization: `1111` })
            .send({ articleId: article.body.articleWithRelations.id });

        expect(coursesDeleted.body.message).toBe("Invalid Token");
    });

    it("Should not able to delete all courses of an article if user is not logged", async () => {
        const article = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Essa é uma notícia",
                subTitle: "a cruz de malta é meu pendão",
                content: "tu tens o nome do heroico portugues",
                isHighlight: false,
                authors: [admin],
                classes: [],
                courses: [course1.body.course.id, course2.body.course.id],
            });

        const coursesDeleted = await request(app)
            .patch("/courses/deleteallcourses")
            .send({ articleId: article.body.articleWithRelations.id });

        expect(coursesDeleted.body.message).toBe("Token missing");
    });
});
