/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import { Category } from "@prisma/client";
import { prisma } from "@shared/database/prismaClient";
import request from "supertest";
import { AppError } from "../../../../../shared/errors/AppError";
import { app } from "../../../../../shared/infra/http/app";

describe("Delete Category Controller", () => {
    let token: string;
    let category;

    beforeAll(async () => {
        const loginAdmin = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        token = loginAdmin.body.token;

        category = await request(app)
            .post("/categories")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test",
            });
    });

    it("Should be able to delete a category", async () => {
        const responseDelete = await request(app)
            .delete(`/categories/${category.body.category.id}`)
            .set({ Authorization: `Bearer ${token}` });

        expect(responseDelete.body.log.description).toBe(
            "Category successfully deleted!"
        );
        expect(responseDelete.status).toBe(200);
    });

    it("Should not be able to delete a category if you was not logged", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const category2 = await request(app)
            .post("/categories")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test",
            });

        const responseDelete = await request(app).delete(
            `/categories/${category2.body.category.id}`
        );

        expect(responseDelete.body.message).toBe("Token missing");
    });

    it("Should not be able to delete a category if token is invalid or expired", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const category3 = await request(app)
            .post("/categories")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test 2",
            });

        const responseDelete = await request(app)
            .delete(`/categories/${category3.body.category.id}`)
            .set({ Authorization: `Bearer 1111` });

        expect(responseDelete.body.message).toBe("Invalid Token");
    });
});
