/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import { prisma } from "@shared/database/prismaClient";
import request from "supertest";
import { AppError } from "../../../../../shared/errors/AppError";
import { app } from "../../../../../shared/infra/http/app";

describe("Delete Tag Controller", () => {
    it("Should be able to delete a tag", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const { token } = responseToken.body;

        const tag = await request(app)
            .post("/tags")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test",
            });

        const responseDelete = await request(app)
            .delete(`/tags/${tag.body.tag.name}`)
            .set({ Authorization: `Bearer ${token}` });

        expect(responseDelete.body.log.description).toBe(
            "Tag successfully deleted!"
        );
        expect(responseDelete.status).toBe(200);
    });

    it("Should not be able to delete a tag if you was not logged", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const { token } = responseToken.body;
        const tag = await request(app)
            .post("/tags")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test",
            });

        const responseDelete = await request(app).delete(
            `/tags/${tag.body.tag.name}`
        );

        expect(responseDelete.body.message).toBe("Token missing");
    });

    it("Should not be able to delete a tag if token is invalid or expired", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const { token } = responseToken.body;

        const tag = await request(app)
            .post("/tags")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test 2",
            });

        const responseDelete = await request(app)
            .delete(`/tags/${tag.body.tag.name}`)
            .set({ Authorization: `Bearer 1111` });

        expect(responseDelete.body.message).toBe("Invalid Token");
    });
});
