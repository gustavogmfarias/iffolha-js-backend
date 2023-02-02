/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { app } from "../../../../../shared/infra/http/app";

describe("CLASSES - List Classes by Course Controller", () => {
    let token: string;
    let course1;
    let course2;
    let newClass1;
    let newClass2;
    let newClass3;
    let newClass4;

    beforeAll(async () => {
        const loginAdmin = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        token = loginAdmin.body.token;

        course1 = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "aaa",
                schoolLevel: "SUPERIOR",
            });

        course2 = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "aaa2",
                schoolLevel: "SUPERIOR",
            });

        newClass1 = await request(app)
            .post("/classes")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Class 1",
                courseId: course1.body.course.id,
            });

        newClass2 = await request(app)
            .post("/classes")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Class 2",
                courseId: course1.body.course.id,
            });

        newClass3 = await request(app)
            .post("/classes")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Class 3",
                courseId: course1.body.course.id,
            });

        newClass4 = await request(app)
            .post("/classes")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Class 4",
                courseId: course2.body.course.id,
            });
    });

    it("Should be able to list classes by courseId", async () => {
        const searchA = await request(app)
            .get(`/classes/classesbycourse?courseId=${course1.body.course.id}`)
            .set({ Authorization: `Bearer ${token}` });

        const searchB = await request(app)
            .get(`/classes/classesbycourse?courseId=${course2.body.course.id}`)
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(3);
        expect(searchB.status).toBe(200);
        expect(searchB.body).toHaveLength(1);
    });

    it("Should be able to list classes by course with pagination", async () => {
        const searchA = await request(app)
            .get(
                `/classes/classesbycourse?page=1&perPage=1&courseId=${course1.body.course.id}`
            )
            .set({ Authorization: `Bearer ${token}` });

        const searchB = await request(app)
            .get(
                `/classes/classesbycourse?page=2&perPage=1&courseId=${course1.body.course.id}`
            )
            .set({ Authorization: `Bearer ${token}` });

        const searchC = await request(app)
            .get(
                `/classes/classesbycourse?page=3&perPage=1&courseId=${course1.body.course.id}`
            )
            .set({ Authorization: `Bearer ${token}` });

        const searchD = await request(app)
            .get(
                `/classes/classesbycourse?page=1&perPage=2&courseId=${course1.body.course.id}`
            )
            .set({ Authorization: `Bearer ${token}` });

        const searchE = await request(app)
            .get(
                `/classes/classesbycourse?page=2&perPage=2&courseId=${course1.body.course.id}`
            )
            .set({ Authorization: `Bearer ${token}` });
        expect(searchA.body).toHaveLength(1);
        expect(searchB.body).toHaveLength(1);
        expect(searchC.body).toHaveLength(1);
        expect(searchD.body).toHaveLength(2);
        expect(searchE.body).toHaveLength(1);
    });

    it("Should not be able to list the classes by courseID if you was not logged", async () => {
        const response = await request(app).get(
            `/classes/classesbycourse?page=1&perPage=1&courseId=${course1.body.course.id}`
        );

        expect(response.body.message).toBe("Token missing");
    });

    it("Should not be able to list the courses by level if token was expired or invalid", async () => {
        const response = await request(app)
            .get(
                `/classes/classesbycourse?page=1&perPage=1&courseId=${course1.body.course.id}`
            )
            .set({ Authorization: `Bearer 111` });

        expect(response.body.message).toBe("Invalid Token");
    });
});
