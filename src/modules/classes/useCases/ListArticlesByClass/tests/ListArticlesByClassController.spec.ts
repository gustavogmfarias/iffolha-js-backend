/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { app } from "../../../../../shared/infra/http/app";

describe("CLASSES - List Articles by Classes Controller", () => {
    let token: string;
    let newCourse;
    let newClass1;

    beforeAll(async () => {
        const loginAdmin = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        token = loginAdmin.body.token;

        newCourse = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Course 1",
                schoolLevel: "SUPERIOR",
            });

        newClass1 = await request(app)
            .post("/classes")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Class 1",
                courseId: newCourse.body.course.id,
            });

        const article1 = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "aaa aaa",
                subTitle: "aaa aaa",
                content: "aaa aaa",
                isHighlight: false,
                authors: [],
                tags: ["aaa"],
                classes: [newClass1.body.newClass.id],
            });

        const article2 = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "bbb bbb",
                subTitle: "bbb bbb",
                content: "bbb bbb",
                isHighlight: false,
                authors: [],
                tags: ["bbb"],
                classes: [newClass1.body.newClass.id],
            });

        const article3 = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "aquiéBBB2",
                subTitle: "bbb2 bbb2",
                content: "bbb2 bbb2",
                isHighlight: false,
                authors: [],
                tags: ["bbb"],
                classes: [newClass1.body.newClass.id],
            });
    });

    it("Should be able to list articles by classes", async () => {
        const searchA = await request(app)
            .get(`/classes/articlesbyclass?className=Teste%20De%20Class%201`)
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(3);
    });

    it("Should be able to list articles by classes & titleName", async () => {
        const searchA = await request(app)
            .get(
                `/classes/articlesbyclass?articleTitle=aaa%20aaa&className=Teste%20De%20Class%201`
            )
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(1);
    });

    it("Should be able to list articles by classes with pagination", async () => {
        const searchA = await request(app)
            .get(
                `/classes/articlesbyclass?page=2&perPage=1&className=Teste%20De%20Class%201`
            )
            .set({ Authorization: `Bearer ${token}` });

        const searchB = await request(app)
            .get(
                `/classes/articlesbyclass?page=1&perPage=2&className=Teste%20De%20Class%201`
            )
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(1);
        expect(searchB.status).toBe(200);
        expect(searchB.body).toHaveLength(2);
    });

    it("Should not be able to list all classes if you was not logged", async () => {
        const response = await request(app).get(
            `/classes/articlesbyclass?articleTitle=aaa%20aaa&page=1&perPage=1&className=Teste%20De%20Class%201`
        );

        expect(response.body.message).toBe("Token missing");
    });

    it("Should not be able to list all classes if token was expired or invalid", async () => {
        const response = await request(app)
            .get(
                `/classes/articlesbyclass?articleTitle=aaa%20aaa&page=1&perPage=1&className=Teste%20De%20Class%201`
            )
            .set({ Authorization: `Bearer 111` });

        expect(response.body.message).toBe("Invalid Token");
    });
});
