/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { AppError } from "../../../../../shared/errors/AppError";
import { app } from "../../../../../shared/infra/http/app";

describe("Create Category Controller", () => {
    let token: string;

    beforeAll(async () => {
        const loginAdmin = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        token = loginAdmin.body.token;
    });

    it("Should be able to create a new category", async () => {
        const response = await request(app)
            .post("/categories")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Categoria 1",
            });

        expect(response.body.category.name).toBe("Teste De Categoria 1");
        expect(response.body.log.description).toBe(
            "Category created successfully!"
        );

        expect(response.status).toBe(201);
    });

    it("Should not be able to create a new category with same name", async () => {
        const response = await request(app)
            .post("/categories")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Categoria 1",
            });

        expect(response.body.message).toBe("Category already exists");
        expect(response.status).toBe(400);
    });

    it("Should not be able to create a new category if the token is invalid", async () => {
        const response = await request(app)
            .post("/categories")
            .set({ Authorization: `Bearer 111111` })
            .send({
                name: "test2",
            });

        expect(response.body.message).toBe("Invalid Token");
    });

    it("Should not be able to create a new Categort if user is not logged", async () => {
        const response = await request(app).post("/categories").send({
            name: "test2",
        });

        expect(response.body.message).toBe("Token missing");
    });
});
