/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { app } from "../../../../../shared/infra/http/app";

describe("COURSE - List Courses Controller", () => {
    beforeAll(async () => {
        const loginAdmin = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const { token } = loginAdmin.body;

        const course = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test",
                schoolLevel: "SUPERIOR",
            });

        const course2 = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test2",
                schoolLevel: "SUPERIOR",
            });

        const course3 = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test 3",
                schoolLevel: "SUPERIOR",
            });

        const course4 = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test 4",
                schoolLevel: "SUPERIOR",
            });
    });

    it("Should be able to list all courses", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });
        const { token } = responseToken.body;

        const searchA = await request(app)
            .get(`/courses?page&perPage&name`)
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(6);
    });

    it("Should be able to list all courses with pagination", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });
        const { token } = responseToken.body;

        const searchA = await request(app)
            .get(`/courses?page=1&perPage=1&name`)
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(1);
        expect(searchA.body[0].name).toBe("Informática");
    });

    it("Should be able to list the courses searching by name", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });
        const { token } = responseToken.body;

        const searchA = await request(app)
            .get(`/courses?name=test`)
            .set({ Authorization: `Bearer ${token}` });

        const searchA2 = await request(app)
            .get(`/courses?name=serie`)
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(4);
        expect(searchA2.body).toHaveLength(0);
    });

    it("Should be able to list the courses searching by name and pagination", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });
        const { token } = responseToken.body;

        const searchA = await request(app)
            .get(`/courses?name=test&page=1&perPage=1`)
            .set({ Authorization: `Bearer ${token}` });

        const searchA2 = await request(app)
            .get(`/courses?name=test&page=2&perPage=2`)
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(1);
        expect(searchA2.body).toHaveLength(2);
    });

    it("Should not be able to list all courses if you was not logged", async () => {
        const response = await request(app).get(`/courses`);

        expect(response.body.message).toBe("Token missing");
    });

    it("Should not be able to list all courses if token was expired or invalid", async () => {
        const response = await request(app)
            .get(`/courses`)
            .set({ Authorization: `Bearer 111` });

        expect(response.body.message).toBe("Invalid Token");
    });
});
