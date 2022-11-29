/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import { AppError } from "../../../../../shared/errors/AppError";
import { app } from "../../../../../shared/infra/http/app";
import request from "supertest";

describe("Create User Controller", () => {
    it("Should be able to create a new user and add a log with default role", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        const { token } = responseToken.body;

        const response = await request(app)
            .post("/users")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                email: "testIntegration@test.com.br",
                name: "Test ",
                lastName: "Integration",
                password: "test",
            });

        const novoUserLogin = await request(app)
            .post("/sessions")
            .send({ email: "testIntegration@test.com.br", password: "test" });

        const log = response.body[1];

        expect(response.body[0].role).toBe("USER");
        expect(novoUserLogin.body).toHaveProperty("token");
        expect(log.description).toBe("User created successfully!");

        expect(response.status).toBe(201);
    });

    //     Must be able to create an article with Tags, Authors, Courses, Classes, Categories and Textual Generos, and as a highlight.
    // You should not be able to create an article without a title.
    // You should not be able to create an article without a subtitle.
    // You should not be able to create an article without content.
    // Should be able to create an article with Authors, Courses, Classes, Categories and Textual Generos, and as a highlight.
    // You should be able to create an article with Tags, Courses, Classes, Categories and Text Genres, and as a highlight.
    // You should be able to create an article with Tags, Authors, Classes, Categories and Genres, and as a highlight.
    // You should be able to create an article with Tags, Authors, Courses, Categories and Textual Generos, and as a highlight.
    // You should be able to create an article with Tags, Authors, Courses, Classes and Generos Textuais, and as a highlight.
    // You should be able to create an article with Tags, Authors, Courses, Classes and Categories and as a highlight.
    // Must be able to create an article with Tags, Authors, Courses, Classes, Categories and Textual Generos, without highlighting.
    // You should be able to create an article with only one tag.
    // You must be able to create an article and the publisher is the logged in user.
    // You should not be able to create an article if the logged in user is not an admin.
    // You should not be able to create an article if you are not logged in.
    // You should not be able to create an article if the token is invalid.
});
