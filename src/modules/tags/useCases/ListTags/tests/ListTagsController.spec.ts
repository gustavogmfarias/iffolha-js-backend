/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { app } from "../../../../../shared/infra/http/app";

describe("TAGS - List Tags Controller", () => {
    beforeAll(async () => {
        const loginAdmin = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const { token } = loginAdmin.body;

        const tag1 = await request(app)
            .post("/tags")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test",
            });

        const tag2 = await request(app)
            .post("/tags")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test2",
            });

        const tag3 = await request(app)
            .post("/tags")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test 3",
            });

        const tag4 = await request(app)
            .post("/tags")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test 4",
            });
    });

    it("Should be able to list all tags", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });
        const { token } = responseToken.body;

        const searchA = await request(app)
            .get(`/tags?page&perPage&name`)
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(7);
    });

    it("Should be able to list all tags with pagination", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });
        const { token } = responseToken.body;

        const searchA = await request(app)
            .get(`/tags?page=1&perPage=1&name`)
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(1);
        expect(searchA.body[0].name).toBe("serie a");
    });

    it("Should be able to list the tags searching by name", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });
        const { token } = responseToken.body;

        const searchA = await request(app)
            .get(`/tags?name=test`)
            .set({ Authorization: `Bearer ${token}` });

        const searchA2 = await request(app)
            .get(`/tags?name=serie`)
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(4);
        expect(searchA2.body).toHaveLength(3);
    });

    it("Should not be able to list all tags if you was not logged", async () => {
        const response = await request(app).get(`/tags`);

        expect(response.body.message).toBe("Token missing");
    });

    it("Should not be able to list all tags if token was expired or invalid", async () => {
        const response = await request(app)
            .get(`/tags`)
            .set({ Authorization: `Bearer 111` });

        expect(response.body.message).toBe("Invalid Token");
    });
});
