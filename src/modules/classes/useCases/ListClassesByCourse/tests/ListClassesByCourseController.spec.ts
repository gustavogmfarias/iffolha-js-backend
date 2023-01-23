/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { app } from "../../../../../shared/infra/http/app";

describe("COURSES - List Courses by Level Controller", () => {
    let token: string;

    beforeAll(async () => {
        const loginAdmin = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        token = loginAdmin.body.token;

        const aaa = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "aaa",
                schoolLevel: "SUPERIOR",
            });

        const aaa2 = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "aaa2",
                schoolLevel: "SUPERIOR",
            });

        const bbb = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "bbb",
                schoolLevel: "ENSINO_MEDIO",
            });

        const ccc = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "ccc",
                schoolLevel: "TECNICO",
            });
    });

    it("Should be able to list courses by level", async () => {
        const searchA = await request(app)
            .get(`/courses/coursesbylevel?page&perPage&level=SUPERIOR`)
            .set({ Authorization: `Bearer ${token}` });

        const searchB = await request(app)
            .get(`/courses/coursesbylevel?page&perPage&level=ENSINO_MEDIO`)
            .set({ Authorization: `Bearer ${token}` });

        const searchC = await request(app)
            .get(`/courses/coursesbylevel?page&perPage&level=TECNICO`)
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(3);
        expect(searchB.status).toBe(200);
        expect(searchB.body).toHaveLength(2);
        expect(searchC.status).toBe(200);
        expect(searchC.body).toHaveLength(1);
    });

    it("Should be able to list courses by level with pagination", async () => {
        const searchA = await request(app)
            .get(`/courses/coursesbylevel?page=1&perPage=1&level=SUPERIOR`)
            .set({ Authorization: `Bearer ${token}` });

        const searchB = await request(app)
            .get(`/courses/coursesbylevel?page=2&perPage=1&level=SUPERIOR`)
            .set({ Authorization: `Bearer ${token}` });

        const searchC = await request(app)
            .get(`/courses/coursesbylevel?page=3&perPage=1&level=SUPERIOR`)
            .set({ Authorization: `Bearer ${token}` });

        const searchD = await request(app)
            .get(`/courses/coursesbylevel?page=1&perPage=2&level=SUPERIOR`)
            .set({ Authorization: `Bearer ${token}` });
        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(1);
        expect(searchB.status).toBe(200);
        expect(searchB.body).toHaveLength(1);
        expect(searchC.status).toBe(200);
        expect(searchC.body).toHaveLength(1);
        expect(searchD.status).toBe(200);
        expect(searchD.body).toHaveLength(2);
    });

    it("Should not be able to list the courses by level if you was not logged", async () => {
        const response = await request(app).get(
            `/courses/coursesbylevel?page=1&perPage=2&level=SUPERIOR`
        );

        expect(response.body.message).toBe("Token missing");
    });

    it("Should not be able to list the courses by level if token was expired or invalid", async () => {
        const response = await request(app)
            .get(`/courses/coursesbylevel?page=1&perPage=2&level=SUPERIOR`)
            .set({ Authorization: `Bearer 111` });

        expect(response.body.message).toBe("Invalid Token");
    });
});
