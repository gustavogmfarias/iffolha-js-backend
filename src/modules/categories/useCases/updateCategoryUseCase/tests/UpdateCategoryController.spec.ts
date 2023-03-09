/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { AppError } from "../../../../../shared/errors/AppError";
import { app } from "../../../../../shared/infra/http/app";

describe("Update Category Controller", () => {
    let token: string;

    beforeAll(async () => {
        const loginAdmin = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        token = loginAdmin.body.token;
    });

    it("Should be able to update a category", async () => {
        const response = await request(app)
            .post("/categories")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Categoria 1",
            });

        expect(response.body.category.name).toBe("Teste De Categoria 1");

        const categoryUpdated = await request(app)
            .put(`/categories/${response.body.category.id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Categoria 2",
            });

        expect(categoryUpdated.body.categoryUpdated.name).toBe(
            "Teste De Categoria 2"
        );
    });

    it("Should not be able to update a new category with same name", async () => {
        const category1 = await request(app)
            .post("/categories")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Categoria 3",
            });

        const category2 = await request(app)
            .post("/categories")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Categoria 4",
            });

        const categoryUpdated = await request(app)
            .put(`/categories/${category2.body.category.id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Categoria 3",
            });

        expect(categoryUpdated.body.message).toBe("Category already exists");
        expect(categoryUpdated.status).toBe(400);
    });

    it("Should not be able to create a new category if the token is invalid", async () => {
        const response = await request(app)
            .put(`/categories/111`)
            .set({ Authorization: `Bearer 111111` })
            .send({
                name: "test2",
            });

        expect(response.body.message).toBe("Invalid Token");
    });

    it("Should not be able to update a new Categort if user is not logged", async () => {
        const response = await request(app).put("/categories/1111").send({
            name: "test2",
        });

        expect(response.body.message).toBe("Token missing");
    });
});
