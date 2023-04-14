/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import { ClassOnArticles } from "@prisma/client";
import { AppError } from "../../../../../shared/errors/AppError";
import { app } from "../../../../../shared/infra/http/app";

describe("Create Article Controller", () => {
    let token;

    let category1;
    let category2;

    let textualGenre1;
    let textualGenre2;

    let course1;
    let course2;

    let class1;
    let class2;

    let author1;
    let author2;

    beforeAll(async () => {
        const loginAdmin = await request(app)
            .post("/sessions")
            .send({ email: "admin@admin.com", password: "admin" });

        token = loginAdmin.body.token;

        category1 = await request(app)
            .post("/categories")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test",
            });

        category2 = await request(app)
            .post("/categories")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test 2",
            });

        textualGenre1 = await request(app)
            .post("/textualgenre")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test",
            });

        textualGenre2 = await request(app)
            .post("/textualgenre")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test 2",
            });

        course1 = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test",
                schoolLevel: "SUPERIOR",
            });

        course2 = await request(app)
            .post("/courses")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "test 2",
                schoolLevel: "SUPERIOR",
            });

        class1 = await request(app)
            .post("/classes")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Class 1",
                courseId: course1.body.course.id,
            });

        class2 = await request(app)
            .post("/classes")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Teste De Class 2",
                courseId: course2.body.course.id,
            });

        author1 = await request(app)
            .post("/users")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                email: "author1@author1.com",
                name: "Author 1",
                lastName: "1",
                password: "author1",
            });

        author2 = await request(app)
            .post("/users")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                email: "author2@author2.com",
                name: "Author 2",
                lastName: "2",
                password: "author2",
            });
    });

    it("Should be able to create a new article with no authors, no tags, no categories, no textual genres, no courses and no classes ", async () => {
        const novaNoticia = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Primeira notícia",
                subTitle: "Essa é a primeira notícia criada",
                content: "conteúdo da prmeira notícia é",
                isHighlight: true,
                authors: [],
                tags: [],
                categories: [],
                textualGenres: [],
                courses: [],
                classes: [],
            });

        const novaNoticiaBody = novaNoticia.body.articleWithRelations;
        const novaNoticiaLog = novaNoticia.body.log;

        expect(novaNoticiaBody).toHaveProperty("id");
        expect(novaNoticiaBody.title).toBe("Primeira notícia");
        expect(novaNoticiaBody.subTitle).toBe(
            "Essa é a primeira notícia criada"
        );

        expect(novaNoticiaBody.content).toBe("conteúdo da prmeira notícia é");
        expect(novaNoticiaBody.isHighlight).toBe(true);
        expect(novaNoticiaBody.TagsOnArticles).toHaveLength(0);
        expect(novaNoticiaBody.CoursesOnArticles).toHaveLength(0);
        expect(novaNoticiaBody.CategoryOnArticles).toHaveLength(0);
        expect(novaNoticiaBody.TextualGenreOnArticles).toHaveLength(0);
        expect(novaNoticiaBody.ClassOnArticles).toHaveLength(0);
        expect(novaNoticiaBody.AuthorsOnArticles).toHaveLength(0);

        expect(novaNoticiaLog.description).toBe(
            "Article created successfully!"
        );

        expect(novaNoticia.status).toBe(201);
    });

    it("Should be able to create a new article with one tag", async () => {
        const novaNoticiaComUmaTag = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Primeira notícia",
                subTitle: "Essa é a primeira notícia criada",
                content: "conteúdo da prmeira notícia é",
                isHighlight: true,
                authors: [],
                tags: ["notícia1"],
                categories: [],
                textualGenres: [],
                courses: [],
                classes: [],
            });

        const novaNoticiaComUmaTagBody =
            novaNoticiaComUmaTag.body.articleWithRelations;
        const novaNoticiaComUmaTagLog = novaNoticiaComUmaTag.body.log;

        expect(novaNoticiaComUmaTagBody).toHaveProperty("id");
        expect(novaNoticiaComUmaTagBody.title).toBe("Primeira notícia");
        expect(novaNoticiaComUmaTagBody.subTitle).toBe(
            "Essa é a primeira notícia criada"
        );
        expect(novaNoticiaComUmaTagBody.content).toBe(
            "conteúdo da prmeira notícia é"
        );
        expect(novaNoticiaComUmaTagBody.isHighlight).toBe(true);
        expect(novaNoticiaComUmaTagBody.TagsOnArticles).toHaveLength(1);
        expect(novaNoticiaComUmaTagBody.TagsOnArticles[0].tag.name).toBe(
            "notícia1"
        );

        expect(novaNoticiaComUmaTagLog.description).toBe(
            "Article created successfully!"
        );

        expect(novaNoticiaComUmaTag.status).toBe(201);
    });

    it("Should be able to create a new article with two tags", async () => {
        const novaNoticiaComDuasTags = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Primeira notícia",
                subTitle: "Essa é a primeira notícia criada",
                content: "conteúdo da prmeira notícia é",
                isHighlight: true,
                authors: [],
                tags: ["notícia1", "segundaTagNotícia1"],
                categories: [],
                textualGenres: [],
                courses: [],
                classes: [],
            });

        const novaNoticiaComDuasTagsBody =
            novaNoticiaComDuasTags.body.articleWithRelations;
        const novaNoticiaComDuasTagsLog = novaNoticiaComDuasTags.body.log;

        expect(novaNoticiaComDuasTagsBody).toHaveProperty("id");
        expect(novaNoticiaComDuasTagsBody.title).toBe("Primeira notícia");
        expect(novaNoticiaComDuasTagsBody.subTitle).toBe(
            "Essa é a primeira notícia criada"
        );
        expect(novaNoticiaComDuasTagsBody.content).toBe(
            "conteúdo da prmeira notícia é"
        );
        expect(novaNoticiaComDuasTagsBody.isHighlight).toBe(true);

        expect(novaNoticiaComDuasTagsBody.TagsOnArticles[0].tag.name).toBe(
            "notícia1"
        );
        expect(novaNoticiaComDuasTagsBody.TagsOnArticles[1].tag.name).toBe(
            "segundaTagNotícia1"
        );

        expect(novaNoticiaComDuasTagsLog.description).toBe(
            "Article created successfully!"
        );

        expect(novaNoticiaComDuasTags.status).toBe(201);

        expect(novaNoticiaComDuasTagsBody.TagsOnArticles).toHaveLength(2);
    });

    it("Should be able to create a new article with one category", async () => {
        const novaNoticiaComUmaCategoria = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Primeira notícia",
                subTitle: "Essa é a primeira notícia criada",
                content: "conteúdo da prmeira notícia é",
                isHighlight: false,
                authors: [],
                tags: ["notícia1"],
                categories: [category1.body.category.id],
                textualGenres: [],
                courses: [],
                classes: [],
            });

        const novaNoticiaComUmaCategoriaBody =
            novaNoticiaComUmaCategoria.body.articleWithRelations;

        expect(novaNoticiaComUmaCategoriaBody.isHighlight).toBe(false);
        expect(novaNoticiaComUmaCategoriaBody.CategoryOnArticles).toHaveLength(
            1
        );
        expect(
            novaNoticiaComUmaCategoriaBody.CategoryOnArticles[0].category.name
        ).toBe("test");
    });

    it("Should be able to create a new article with two categories", async () => {
        const novaNoticiaComDuasCategorias = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Primeira notícia",
                subTitle: "Essa é a primeira notícia criada",
                content: "conteúdo da prmeira notícia é",
                isHighlight: true,
                authors: [],
                tags: ["notícia1"],
                categories: [
                    category1.body.category.id,
                    category2.body.category.id,
                ],

                textualGenres: [],
                courses: [],
                classes: [],
            });

        const novaNoticiaComDuasCategoriasBody =
            novaNoticiaComDuasCategorias.body.articleWithRelations;
        expect(
            novaNoticiaComDuasCategoriasBody.CategoryOnArticles
        ).toHaveLength(2);
        expect(
            novaNoticiaComDuasCategoriasBody.CategoryOnArticles[0].category.name
        ).toBe("test 2");
        expect(
            novaNoticiaComDuasCategoriasBody.CategoryOnArticles[1].category.name
        ).toBe("test");
    });

    it("Should be able to create a new article with one textual genre", async () => {
        const novaNoticiaComUmTextualGenre = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Primeira notícia",
                subTitle: "Essa é a primeira notícia criada",
                content: "conteúdo da prmeira notícia é",
                isHighlight: false,
                authors: [],
                tags: ["notícia1"],
                categories: [category1.body.category.id],
                textualGenres: [textualGenre1.body.textualGenre.id],

                courses: [],
                classes: [],
            });

        const novaNoticiaComUmTextualGenreBody =
            novaNoticiaComUmTextualGenre.body.articleWithRelations;
        const novaNoticiaComUmTextualGenreLog =
            novaNoticiaComUmTextualGenre.body.log;

        expect(
            novaNoticiaComUmTextualGenreBody.TextualGenreOnArticles
        ).toHaveLength(1);
        expect(
            novaNoticiaComUmTextualGenreBody.TextualGenreOnArticles[0]
                .textualGenre.name
        ).toBe("test");

        expect(novaNoticiaComUmTextualGenreLog.description).toBe(
            "Article created successfully!"
        );
    });

    it("Should be able to create a new article with two textual genres", async () => {
        const novaNoticiaComDoisTextualGenres = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Primeira notícia",
                subTitle: "Essa é a primeira notícia criada",
                content: "conteúdo da prmeira notícia é",
                isHighlight: true,
                authors: [],
                tags: ["notícia1"],
                categories: [category1.body.category.id],
                textualGenres: [
                    textualGenre1.body.textualGenre.id,
                    textualGenre2.body.textualGenre.id,
                ],

                courses: [],
                classes: [],
            });

        const novaNoticiaComDoisTextualGenresBody =
            novaNoticiaComDoisTextualGenres.body.articleWithRelations;
        const novaNoticiaComDoisTextualGenresLog =
            novaNoticiaComDoisTextualGenres.body.log;

        expect(novaNoticiaComDoisTextualGenresBody.isHighlight).toBe(true);
        expect(
            novaNoticiaComDoisTextualGenresBody.TextualGenreOnArticles
        ).toHaveLength(2);
        expect(
            novaNoticiaComDoisTextualGenresBody.TextualGenreOnArticles[0]
                .textualGenre.name
        ).toBe("test 2");
        expect(
            novaNoticiaComDoisTextualGenresBody.TextualGenreOnArticles[1]
                .textualGenre.name
        ).toBe("test");
    });

    it("Should be able to create a new article with one course", async () => {
        const novaNoticiaComUmCourse = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Primeira notícia",
                subTitle: "Essa é a primeira notícia criada",
                content: "conteúdo da prmeira notícia é",
                isHighlight: false,
                authors: [],
                tags: ["notícia1"],
                categories: [category1.body.category.id],
                textualGenres: [textualGenre1.body.textualGenre.id],
                courses: [course1.body.course.id],
                classes: [],
            });

        const novaNoticiaComUmCourseBody =
            novaNoticiaComUmCourse.body.articleWithRelations;
        const novaNoticiaComUmCourseLog = novaNoticiaComUmCourse.body.log;

        expect(novaNoticiaComUmCourseBody.isHighlight).toBe(false);
        expect(novaNoticiaComUmCourseBody.CoursesOnArticles).toHaveLength(1);
        expect(
            novaNoticiaComUmCourseBody.CoursesOnArticles[0].course.name
        ).toBe("test");

        expect(novaNoticiaComUmCourseLog.description).toBe(
            "Article created successfully!"
        );
    });

    it("Should be able to create a new article with two courses", async () => {
        const novaNoticiaComDoisCourses = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Primeira notícia",
                subTitle: "Essa é a primeira notícia criada",
                content: "conteúdo da prmeira notícia é",
                isHighlight: false,
                authors: [],
                tags: ["notícia1"],
                categories: [category1.body.category.id],
                textualGenres: [textualGenre1.body.textualGenre.id],
                courses: [course1.body.course.id, course2.body.course.id],
                classes: [],
            });

        const novaNoticiaComDoisCoursesBody =
            novaNoticiaComDoisCourses.body.articleWithRelations;
        const novaNoticiaComDoisCoursesLog = novaNoticiaComDoisCourses.body.log;

        expect(novaNoticiaComDoisCoursesBody.isHighlight).toBe(false);
        expect(novaNoticiaComDoisCoursesBody.CoursesOnArticles).toHaveLength(2);
        expect(
            novaNoticiaComDoisCoursesBody.CoursesOnArticles[1].course.name
        ).toBe("test");
        expect(
            novaNoticiaComDoisCoursesBody.CoursesOnArticles[0].course.name
        ).toBe("test 2");
    });

    // it("Should be able to create a new article with one class", async () => {
    //     const novaNoticiaComUmCourse = await request(app)
    //         .post("/articles")
    //         .set({ Authorization: `Bearer ${token}` })
    //         .send({
    //             title: "Primeira notícia",
    //             subTitle: "Essa é a primeira notícia criada",
    //             content: "conteúdo da prmeira notícia é",
    //             isHighlight: false,
    //             authors: [],
    //             tags: ["notícia1"],
    //             categories: [category1.body.category.id],
    //             textualGenres: [textualGenre1.body.textualGenre.id],
    //             courses: [course1.body.course.id],
    //             classes: [class1.body.newClass.id],
    //         });

    //     const articleFoundById = await request(app)
    //         .get(
    //             `/articles/${novaNoticiaComUmCourse.body.articleWithRelations.id}`
    //         )
    //         .set({ Authorization: `Bearer ${token}` });

    //     const novaNoticiaComUmCourseBody = articleFoundById.body;
    //     const novaNoticiaComUmCourseLog = novaNoticiaComUmCourse.body.log;

    //     expect(novaNoticiaComUmCourseBody).toHaveProperty("id");
    //     expect(novaNoticiaComUmCourseBody.title).toBe("Primeira notícia");
    //     expect(novaNoticiaComUmCourseBody.subTitle).toBe(
    //         "Essa é a primeira notícia criada"
    //     );
    //     expect(novaNoticiaComUmCourseBody.content).toBe(
    //         "conteúdo da prmeira notícia é"
    //     );
    //     expect(novaNoticiaComUmCourseBody.isHighlight).toBe(false);
    //     expect(novaNoticiaComUmCourseBody.ClassesOnArticles).toHaveLength(1);
    //     expect(articleFoundById.body.ClassesOnArticles[0]).toBe(
    //         "Teste De Class 1"
    //     );

    //     expect(novaNoticiaComUmCourseLog.description).toBe(
    //         "Article created successfully!"
    //     );

    //     expect(novaNoticiaComUmCourse.status).toBe(201);
    // });

    // it("Should be able to create a new article with two classes", async () => {
    //     const novaNoticiaComUmCourse = await request(app)
    //         .post("/articles")
    //         .set({ Authorization: `Bearer ${token}` })
    //         .send({
    //             title: "Primeira notícia",
    //             subTitle: "Essa é a primeira notícia criada",
    //             content: "conteúdo da prmeira notícia é",
    //             isHighlight: false,
    //             authors: [],
    //             tags: ["notícia1"],
    //             categories: [category1.body.category.id],
    //             textualGenres: [textualGenre1.body.textualGenre.id],
    //             courses: [course1.body.course.id],
    //             classes: [class1.body.newClass.id, class2.body.newClass.id],
    //         });

    //     const articleFoundById = await request(app)
    //         .get(
    //             `/articles/${novaNoticiaComUmCourse.body.articleWithRelations.id}`
    //         )
    //         .set({ Authorization: `Bearer ${token}` });

    //     const novaNoticiaComUmCourseBody = articleFoundById.body;
    //     const novaNoticiaComUmCourseLog = novaNoticiaComUmCourse.body.log;

    //     expect(novaNoticiaComUmCourseBody).toHaveProperty("id");
    //     expect(novaNoticiaComUmCourseBody.title).toBe("Primeira notícia");
    //     expect(novaNoticiaComUmCourseBody.subTitle).toBe(
    //         "Essa é a primeira notícia criada"
    //     );
    //     expect(novaNoticiaComUmCourseBody.content).toBe(
    //         "conteúdo da prmeira notícia é"
    //     );
    //     expect(novaNoticiaComUmCourseBody.isHighlight).toBe(false);
    //     expect(novaNoticiaComUmCourseBody.ClassesOnArticles).toHaveLength(2);
    //     expect(articleFoundById.body.ClassesOnArticles[0]).toBe(
    //         "Teste De Class 1"
    //     );

    //     expect(articleFoundById.body.ClassesOnArticles[1]).toBe(
    //         "Teste De Class 2"
    //     );

    //     expect(novaNoticiaComUmCourseLog.description).toBe(
    //         "Article created successfully!"
    //     );

    //     expect(novaNoticiaComUmCourse.status).toBe(201);
    // });

    // it("Should be able to create a new article with one author", async () => {
    //     const novaNoticiaComUmAuthor = await request(app)
    //         .post("/articles")
    //         .set({ Authorization: `Bearer ${token}` })
    //         .send({
    //             title: "Primeira notícia",
    //             subTitle: "Essa é a primeira notícia criada",
    //             content: "conteúdo da prmeira notícia é",
    //             isHighlight: false,
    //             tags: ["notícia1"],
    //             categories: [category1.body.category.id],
    //             textualGenres: [textualGenre1.body.textualGenre.id],
    //             courses: [course1.body.course.id],
    //             classes: [class1.body.newClass.id],
    //             authors: [author1.body[0].id],
    //         });

    //     const articleFoundById = await request(app)
    //         .get(
    //             `/articles/${novaNoticiaComUmAuthor.body.articleWithRelations.id}`
    //         )
    //         .set({ Authorization: `Bearer ${token}` });

    //     const novaNoticiaComUmAuthorBody = articleFoundById.body;
    //     const novaNoticiaComUmAuthorLog = novaNoticiaComUmAuthor.body.log;

    //     expect(novaNoticiaComUmAuthorBody).toHaveProperty("id");
    //     expect(novaNoticiaComUmAuthorBody.title).toBe("Primeira notícia");
    //     expect(novaNoticiaComUmAuthorBody.subTitle).toBe(
    //         "Essa é a primeira notícia criada"
    //     );
    //     expect(novaNoticiaComUmAuthorBody.content).toBe(
    //         "conteúdo da prmeira notícia é"
    //     );
    //     expect(novaNoticiaComUmAuthorBody.isHighlight).toBe(false);
    //     expect(novaNoticiaComUmAuthorBody.ClassesOnArticles).toHaveLength(1);
    //     expect(novaNoticiaComUmAuthorBody.AuthorsOnArticles).toHaveLength(1);
    //     expect(articleFoundById.body.AuthorsOnArticles[0]).toBe("Author 1");

    //     expect(novaNoticiaComUmAuthorLog.description).toBe(
    //         "Article created successfully!"
    //     );

    //     expect(novaNoticiaComUmAuthor.status).toBe(201);
    // });

    // it("Should be able to create a new article with two authors", async () => {
    //     const novaNoticiaComDoisAuthors = await request(app)
    //         .post("/articles")
    //         .set({ Authorization: `Bearer ${token}` })
    //         .send({
    //             title: "Primeira notícia",
    //             subTitle: "Essa é a primeira notícia criada",
    //             content: "conteúdo da prmeira notícia é",
    //             isHighlight: false,
    //             tags: ["notícia1"],
    //             categories: [category1.body.category.id],
    //             textualGenres: [textualGenre1.body.textualGenre.id],
    //             courses: [course1.body.course.id],
    //             classes: [class1.body.newClass.id],
    //             authors: [author1.body[0].id, author2.body[0].id],
    //         });

    //     const articleFoundById = await request(app)
    //         .get(
    //             `/articles/${novaNoticiaComDoisAuthors.body.articleWithRelations.id}`
    //         )
    //         .set({ Authorization: `Bearer ${token}` });

    //     const novaNoticiaComDoisAuthorBodys = articleFoundById.body;
    //     const novaNoticiaComDoisAuthorLogs = novaNoticiaComDoisAuthors.body.log;

    //     expect(novaNoticiaComDoisAuthorBodys).toHaveProperty("id");
    //     expect(novaNoticiaComDoisAuthorBodys.title).toBe("Primeira notícia");
    //     expect(novaNoticiaComDoisAuthorBodys.subTitle).toBe(
    //         "Essa é a primeira notícia criada"
    //     );
    //     expect(novaNoticiaComDoisAuthorBodys.content).toBe(
    //         "conteúdo da prmeira notícia é"
    //     );
    //     expect(novaNoticiaComDoisAuthorBodys.isHighlight).toBe(false);
    //     expect(novaNoticiaComDoisAuthorBodys.ClassesOnArticles).toHaveLength(1);
    //     expect(novaNoticiaComDoisAuthorBodys.AuthorsOnArticles).toHaveLength(2);
    //     expect(articleFoundById.body.AuthorsOnArticles[0]).toBe("Author 1");
    //     expect(articleFoundById.body.AuthorsOnArticles[1]).toBe("Author 2");

    //     expect(novaNoticiaComDoisAuthorLogs.description).toBe(
    //         "Article created successfully!"
    //     );

    //     expect(novaNoticiaComDoisAuthors.status).toBe(201);
    // });

    // it("Should not be able to create an article if you was not logged", async () => {
    //     const responseArticle = await request(app).post(`/articles`);

    //     expect(responseArticle.body.message).toBe("Token missing");
    // });

    // it("Should not be able to delete a user if token is invalid or expired", async () => {
    //     const responseArticle = await request(app)
    //         .post(`/articles`)
    //         .set({ Authorization: `Bearer 1111` });

    //     expect(responseArticle.body.message).toBe("Invalid Token");
    // });
});
