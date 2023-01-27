/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { app } from "../../../../../shared/infra/http/app";

describe("CLASS - List Classes Controller", () => {
    let newCourse;
    let token;
    let newClass1;
    let newClass2;
    let newClass3;
    let newClass4;

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

        newClass2 = await request(app)
            .post("/classes")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Class 2",
                courseId: newCourse.body.course.id,
            });

        newClass3 = await request(app)
            .post("/classes")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Class 3",
                courseId: newCourse.body.course.id,
            });
        newClass4 = await request(app)
            .post("/classes")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Class 4",
                courseId: newCourse.body.course.id,
            });
    });

    it("Should be able to list all classes", async () => {
        const searchA = await request(app)
            .get(`/classes`)
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(6);
    });

    it("Should be able to list all classes with pagination", async () => {
        const searchA = await request(app)
            .get(`/classes?page=1&perPage=1`)
            .set({ Authorization: `Bearer ${token}` });

        const searchB = await request(app)
            .get(`/classes?page=2&perPage=1`)
            .set({ Authorization: `Bearer ${token}` });

        const searchC = await request(app)
            .get(`/classes?page=2&perPage=2`)
            .set({ Authorization: `Bearer ${token}` });

        const searchD = await request(app)
            .get(`/classes?page=3&perPage=2`)
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(1);
        expect(searchA.body[0].name).toBe("1ª Série");

        expect(searchB.body[0].name).toBe("1º Período");

        expect(searchC.body).toHaveLength(2);
        expect(searchC.body[0].name).toBe("Teste De Class 1");
        expect(searchC.body[1].name).toBe("Teste De Class 2");

        expect(searchD.body[0].name).toBe("Teste De Class 3");
        expect(searchD.body[1].name).toBe("Teste De Class 4");
    });

    it("Should be able to list the classes searching by name", async () => {
        const searchA = await request(app)
            .get(`/classes?name=Class`)
            .set({ Authorization: `Bearer ${token}` });

        const searchA2 = await request(app)
            .get(`/classes?name=S%C3%A9rie`)
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(4);
        expect(searchA2.body).toHaveLength(1);
    });

    it("Should be able to list the classes searching by name and pagination", async () => {
        const searchA = await request(app)
            .get(`/classes?name=Teste&page=1&perPage=1`)
            .set({ Authorization: `Bearer ${token}` });

        const searchA2 = await request(app)
            .get(`/classes?name=Teste&page=2&perPage=2`)
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(1);
        expect(searchA2.body).toHaveLength(2);
    });

    it("Should not be able to list all classes if you was not logged", async () => {
        const response = await request(app).get(`/classes`);

        expect(response.body.message).toBe("Token missing");
    });

    it("Should not be able to list all classes if token was expired or invalid", async () => {
        const response = await request(app)
            .get(`/classes`)
            .set({ Authorization: `Bearer 111` });

        expect(response.body.message).toBe("Invalid Token");
    });
});
