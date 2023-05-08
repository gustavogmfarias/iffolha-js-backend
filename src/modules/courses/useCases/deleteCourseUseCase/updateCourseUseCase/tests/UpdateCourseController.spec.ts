/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { SchoolLevel } from "@prisma/client";
import { AppError } from "../../../../../shared/errors/AppError";
import { app } from "../../../../../shared/infra/http/app";

describe("COURSES - Update Course Controller", () => {
    let token: string;

    beforeAll(async () => {
        const loginAdmin = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        token = loginAdmin.body.token;
    });

    it("Should be able to update a course", async () => {
        const response = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Course 1",
                schoolLevel: "SUPERIOR",
            });

        const courseUpdate = await request(app)
            .put(`/courses/${response.body.course.id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Course 2",
                schoolLevel: "SUPERIOR",
            });

        expect(response.body.course.name).toBe("Teste De Course 1");
        expect(courseUpdate.body.course.name).toBe("Teste De Course 2");
    });

    it("Should not be able to update a course with same name", async () => {
        const response = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Course 3",
                schoolLevel: "SUPERIOR",
            });

        const response2 = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Course 4",
                schoolLevel: "SUPERIOR",
            });

        const courseUpdate = await request(app)
            .put(`/courses/${response2.body.course.id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Course 3",
                schoolLevel: "SUPERIOR",
            });

        expect(courseUpdate.body.message).toBe("Course already exists");
    });

    it("Should not be able to update a course if the token is invalid", async () => {
        const response = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test5",
                schoolLevel: "SUPERIOR",
            });

        const courseUpdate = await request(app)
            .put(`/courses/${response.body.course.id}`)
            .set({ Authorization: `Bearer 111111` })
            .send({
                name: "Teste De Course 3",
                schoolLevel: "SUPERIOR",
            });

        expect(courseUpdate.body.message).toBe("Invalid Token");
    });

    it("Should not be able to update a Course if user is not logged", async () => {
        const response = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "tes6",
                schoolLevel: "SUPERIOR",
            });

        const courseUpdate = await request(app)
            .put(`/courses/${response.body.course.id}`)
            .send({
                name: "Teste De Course 3",
                schoolLevel: "SUPERIOR",
            });

        expect(courseUpdate.body.message).toBe("Token missing");
    });
});
