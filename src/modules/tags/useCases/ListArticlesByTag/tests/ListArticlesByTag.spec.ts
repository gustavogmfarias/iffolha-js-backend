/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { app } from "../../../../../shared/infra/http/app";

describe("TAGS - List Articles by Tags Controller", () => {
    let token: string;

    beforeAll(async () => {
        const loginAdmin = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        token = loginAdmin.body.token;

        const article1 = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "aaa aaa",
                subTitle: "aaa aaa",
                content: "aaa aaa",
                isHighlight: false,
                authors: [],
                tags: ["aaa"],
            });

        const article2 = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "bbb bbb",
                subTitle: "bbb bbb",
                content: "bbb bbb",
                isHighlight: false,
                authors: [],
                tags: ["bbb"],
            });

        const article3 = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "aquiéBBB2",
                subTitle: "bbb2 bbb2",
                content: "bbb2 bbb2",
                isHighlight: false,
                authors: [],
                tags: ["bbb"],
            });
    });

    it("Should be able to list articles by tags", async () => {
        const searchA = await request(app)
            .get(`/tags/articlesbytag?articleTitle&page&perPage&tagName=aaa`)
            .set({ Authorization: `Bearer ${token}` });

        const searchB = await request(app)
            .get(`/tags/articlesbytag?articleTitle&page&perPage&tagName=bbb`)
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(1);
        expect(searchB.status).toBe(200);
        expect(searchB.body).toHaveLength(2);
    });

    it("Should be able to list articles by tags & titleName", async () => {
        const searchA = await request(app)
            .get(
                `/tags/articlesbytag?articleTitle=aqui&page&perPage&tagName=bbb`
            )
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(1);
    });

    it("Should be able to list articles by tags with pagination", async () => {
        const searchA = await request(app)
            .get(
                `/tags/articlesbytag?articleTitle&page=1&perPage=1&tagName=bbb`
            )
            .set({ Authorization: `Bearer ${token}` });

        const searchB = await request(app)
            .get(
                `/tags/articlesbytag?articleTitle&page=2&perPage=1&tagName=bbb`
            )
            .set({ Authorization: `Bearer ${token}` });

        expect(searchA.status).toBe(200);
        expect(searchA.body).toHaveLength(1);
        expect(searchB.status).toBe(200);
        expect(searchB.body).toHaveLength(1);
    });

    it("Should not be able to list all tags if you was not logged", async () => {
        const response = await request(app).get(
            `/tags/articlesbytag?articleTitle&page&perPage&tagName`
        );

        expect(response.body.message).toBe("Token missing");
    });

    it("Should not be able to list all tags if token was expired or invalid", async () => {
        const response = await request(app)
            .get(`/tags/articlesbytag?articleTitle&page&perPage&tagName`)
            .set({ Authorization: `Bearer 111` });

        expect(response.body.message).toBe("Invalid Token");
    });
});
