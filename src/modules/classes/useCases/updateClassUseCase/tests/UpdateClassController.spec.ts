/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { SchoolLevel } from "@prisma/client";
import { AppError } from "../../../../../shared/errors/AppError";
import { app } from "../../../../../shared/infra/http/app";

describe("CLASSES - Update Class Controller", () => {
    let token: string;
    let newCourse;
    let newCourse2;

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

        newCourse2 = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Course 2",
                schoolLevel: "TECNICO",
            });
    });

    it("Should be able to update class name", async () => {
        const classCreated = await request(app)
            .post("/classes")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Class 1",
                courseId: newCourse.body.course.id,
            });

        expect(classCreated.body.newClass.name).toBe("Teste De Class 1");
        expect(classCreated.body.log.description).toBe(
            "Class created successfully!"
        );

        expect(classCreated.status).toBe(201);
        expect(classCreated.body.newClass.courseId).toBe(
            newCourse.body.course.id
        );

        const classUpdated = await request(app)
            .put(`/classes/${classCreated.body.newClass.id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Class 2",
                courseId: newCourse2.body.course.id,
            });

        expect(classUpdated.body.classUpdated.name).toBe("Teste De Class 2");
        expect(classUpdated.body.classUpdated.courseId).toBe(
            newCourse2.body.course.id
        );
        expect(classUpdated.body.log.description).toBe(
            "Class updated successfully!"
        );

        expect(classUpdated.status).toBe(201);
    });

    it("Should not be possible to update the name of a class with the same name as another class", async () => {
        const classCreated = await request(app)
            .post("/classes")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Class 3",
                courseId: newCourse.body.course.id,
            });

        const classCreated2 = await request(app)
            .post("/classes")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Class 4",
                courseId: newCourse.body.course.id,
            });

        const response = await request(app)
            .put(`/classes/${classCreated2.body.newClass.id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Class 3",
                courseId: newCourse.body.course.id,
            });

        expect(response.body.message).toBe("Class already exists");
        expect(response.status).toBe(400);
    });

    it("Should not be able to update a new class if the token is invalid", async () => {
        const response = await request(app)
            .put(`/classes/${1111}`)
            .set({ Authorization: `Bearer 111111` })
            .send({
                name: "test2",
                courseId: newCourse.body.course.id,
            });

        expect(response.body.message).toBe("Invalid Token");
    });

    it("Should not be able to update a new Class if user is not logged", async () => {
        const response = await request(app).put(`/classes/${1111}`).send({
            name: "test2",
            courseId: newCourse.body.course.id,
        });

        expect(response.body.message).toBe("Token missing");
    });
});
