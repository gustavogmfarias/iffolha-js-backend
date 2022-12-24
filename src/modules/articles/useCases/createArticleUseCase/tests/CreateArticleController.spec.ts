/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { AppError } from "../../../../../shared/errors/AppError";
import { app } from "../../../../../shared/infra/http/app";

describe("Create Article Controller", () => {
    let token;
    beforeAll(async () => {
        const loginAdmin = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        token = loginAdmin.body.token;
    });

    it("Should be able to create a new article with one or more tag", async () => {
        const novaNoticia = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Primeira notícia",
                subTitle: "Essa é a primeira notícia criada",
                content: "conteúdo da prmeira notícia é",
                isHighlight: true,
                authors: [],
                tags: ["notícia1", "segundaTagNotícia1"],
            });

        const novaNoticiaBody = novaNoticia.body[0];
        const novaNoticiaLog = novaNoticia.body[1];

        expect(novaNoticiaBody).toHaveProperty("id");
        expect(novaNoticiaBody.title).toBe("Primeira notícia");
        expect(novaNoticiaBody.subTitle).toBe(
            "Essa é a primeira notícia criada"
        );
        expect(novaNoticiaBody.content).toBe("conteúdo da prmeira notícia é");
        expect(novaNoticiaBody.isHighlight).toBe(true);
        expect(novaNoticiaLog).toBe("Article created successfully!");

        expect(novaNoticia.status).toBe(201);
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
