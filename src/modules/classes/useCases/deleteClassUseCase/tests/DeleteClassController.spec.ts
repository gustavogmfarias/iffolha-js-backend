/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { app } from "../../../../../shared/infra/http/app";

describe("COURSE - Delete Course Controller", () => {
    let token: string;
    let course;
    let class1;

    beforeAll(async () => {
        const loginAdmin = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        token = loginAdmin.body.token;

        course = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test",
                schoolLevel: "SUPERIOR",
            });

        class1 = await request(app)
            .post("/classes")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Class 1",
                courseId: course.body.course.id,
            });
    });

    it("Should be able to delete a class", async () => {
        const responseDelete = await request(app)
            .delete(`/classes/${class1.body.newClass.id}`)
            .set({ Authorization: `Bearer ${token}` });

        expect(responseDelete.body.log.description).toBe(
            "Class successfully deleted!"
        );
        expect(responseDelete.status).toBe(200);
    });

    it("Should not be able to delete a class if you was not logged", async () => {
        const class2 = await request(app)
            .post("/classes")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Class 2",
                courseId: course.body.course.id,
            });

        const responseDelete = await request(app).delete(
            `/classes/${course.body.course.id}`
        );

        expect(responseDelete.body.message).toBe("Token missing");
    });

    it("Should not be able to delete a course if token is invalid or expired", async () => {
        const class3 = await request(app)
            .post("/classes")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Class 3",
                courseId: course.body.course.id,
            });

        const responseDelete = await request(app)
            .delete(`/courses/${class3.body.course.id}`)
            .set({ Authorization: `Bearer 1111` });

        expect(responseDelete.body.message).toBe("Invalid Token");
    });
});
