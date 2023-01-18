/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { SchoolLevel } from "@prisma/client";
import { AppError } from "../../../../../shared/errors/AppError";
import { app } from "../../../../../shared/infra/http/app";

describe("COURSES - Create Course Controller", () => {
    let token: string;

    beforeAll(async () => {
        const loginAdmin = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        token = loginAdmin.body.token;
    });

    it("Should be able to create a new course", async () => {
        const response = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Course 1",
                schoolLevel: "SUPERIOR",
            });

        expect(response.body.course.name).toBe("Teste De Course 1");
        expect(response.body.log.description).toBe(
            "Course created successfully!"
        );

        expect(response.status).toBe(201);
    });

    it("Should not be able to create a new course with same name", async () => {
        const response = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Course 1",
                schoolLevel: "SUPERIOR",
            });

        expect(response.body.message).toBe("Course already exists");
        expect(response.status).toBe(400);
    });

    it("Should not be able to create a new course if the token is invalid", async () => {
        const response = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer 111111` })
            .send({
                name: "test2",
                schoolLevel: "SUPERIOR",
            });

        expect(response.body.message).toBe("Invalid Token");
    });

    it("Should not be able to create a new Course if user is not logged", async () => {
        const response = await request(app).post("/courses").send({
            name: "test2",
            schoolLevel: "SUPERIOR",
        });

        expect(response.body.message).toBe("Token missing");
    });
});
