/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { app } from "../../../../../shared/infra/http/app";

describe("COURSE - Delete Course Controller", () => {
    let token: string;
    let course;

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
    });

    it("Should be able to delete a course", async () => {
        const responseDelete = await request(app)
            .delete(`/courses/${course.body.course.id}`)
            .set({ Authorization: `Bearer ${token}` });

        expect(responseDelete.body.log.description).toBe(
            "Course successfully deleted!"
        );
        expect(responseDelete.status).toBe(200);
    });

    it("Should not be able to delete a course if you was not logged", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const course2 = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test",
                schoolLevel: "SUPERIOR",
            });

        const responseDelete = await request(app).delete(
            `/courses/${course2.body.course.id}`
        );

        expect(responseDelete.body.message).toBe("Token missing");
    });

    it("Should not be able to delete a course if token is invalid or expired", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const course3 = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test 2",
                schoolLevel: "SUPERIOR",
            });

        const responseDelete = await request(app)
            .delete(`/courses/${course3.body.course.id}`)
            .set({ Authorization: `Bearer 1111` });

        expect(responseDelete.body.message).toBe("Invalid Token");
    });
});
