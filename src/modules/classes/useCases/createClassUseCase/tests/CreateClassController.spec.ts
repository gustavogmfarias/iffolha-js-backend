/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { SchoolLevel } from "@prisma/client";
import { AppError } from "../../../../../shared/errors/AppError";
import { app } from "../../../../../shared/infra/http/app";

describe("CLASSES - Create Class Controller", () => {
    let token: string;
    let newCourse;

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
    });

    it("Should be able to create a new class", async () => {
        const response = await request(app)
            .post("/classes")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Class 1",
                courseId: newCourse.body.course.id,
            });

        expect(response.body.newClass.name).toBe("Teste De Class 1");
        expect(response.body.log.description).toBe(
            "Class created successfully!"
        );

        expect(response.status).toBe(201);
    });

    it("Should not be able to create a new class with same name", async () => {
        const response = await request(app)
            .post("/classes")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Class 1",
                courseId: newCourse.body.course.id,
            });

        expect(response.body.message).toBe("Class already exists");
        expect(response.status).toBe(400);
    });

    it("Should not be able to create a new class if the token is invalid", async () => {
        const response = await request(app)
            .post("/classes")
            .set({ Authorization: `Bearer 111111` })
            .send({
                name: "test2",
                courseId: newCourse.body.course.id,
            });

        expect(response.body.message).toBe("Invalid Token");
    });

    it("Should not be able to create a new Class if user is not logged", async () => {
        const response = await request(app).post("/classes").send({
            name: "test2",
            courseId: newCourse.body.course.id,
        });

        expect(response.body.message).toBe("Token missing");
    });
});
