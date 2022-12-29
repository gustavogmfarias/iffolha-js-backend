/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { app } from "../../../../../shared/infra/http/app";

describe("CATEGORIES - List Tags Controller", () => {
    beforeAll(async () => {
        const loginAdmin = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const { token } = loginAdmin.body;

        const category1 = await request(app)
            .post("/categories")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test",
            });

        const category2 = await request(app)
            .post("/categories")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test2",
            });

        const category3 = await request(app)
            .post("/categories")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test 3",
            });

        const category4 = await request(app)
            .post("/categories")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test 4",
            });
    });

    it("Should be able to list all categories", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });
        const { token } = responseToken.body;

        const searchA = await request(app)
            .get(`/categories?page&perPage&name`)
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(7);
    });

    it("Should be able to list all categories with pagination", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });
        const { token } = responseToken.body;

        const searchA = await request(app)
            .get(`/categories?page=1&perPage=1&name`)
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(1);
        expect(searchA.body[0].name).toBe("serie a");
    });

    it("Should be able to list the categories searching by name", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });
        const { token } = responseToken.body;

        const searchA = await request(app)
            .get(`/categories?name=test`)
            .set({ Authorization: `Bearer ${token}` });

        const searchA2 = await request(app)
            .get(`/categories?name=serie`)
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(4);
        expect(searchA2.body).toHaveLength(3);
    });

    it("Should not be able to list all categories if you was not logged", async () => {
        const response = await request(app).get(`/categories`);

        expect(response.body.message).toBe("Token missing");
    });

    it("Should not be able to list all categories if token was expired or invalid", async () => {
        const response = await request(app)
            .get(`/categories`)
            .set({ Authorization: `Bearer 111` });

        expect(response.body.message).toBe("Invalid Token");
    });
});
