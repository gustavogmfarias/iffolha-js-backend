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

        const articleFoundById = await request(app)
            .get(`/articles/${novaNoticia.body.articleWithRelations.id}`)
            .set({ Authorization: `Bearer ${token}` });

        const novaNoticiaBody = articleFoundById.body;
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
        expect(novaNoticiaBody.ClassesOnArticles).toHaveLength(0);
        expect(novaNoticiaBody.AuthorsOnArticles).toHaveLength(0);

        expect(novaNoticiaLog.description).toBe(
            "Article created successfully!"
        );

        expect(novaNoticia.status).toBe(201);
    });

    it("Should be able to create a new article with one tag", async () => {
        const novaNoticiaComDuasTags = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Primeira notícia",
                subTitle: "Essa é a primeira notícia criada",
                content: "conteúdo da prmeira notícia é",
                isHighlight: true,
                authors: [],
                tags: ["notícia1"],
            });

        const articleFoundById = await request(app)
            .get(
                `/articles/${novaNoticiaComDuasTags.body.articleWithRelations.id}`
            )
            .set({ Authorization: `Bearer ${token}` });

        const novaNoticiaComDuasTagsBody = articleFoundById.body;
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
        expect(novaNoticiaComDuasTagsBody.TagsOnArticles).toHaveLength(1);
        expect(articleFoundById.body.TagsOnArticles[0]).toBe("notícia1");

        expect(novaNoticiaComDuasTagsLog.description).toBe(
            "Article created successfully!"
        );

        expect(novaNoticiaComDuasTags.status).toBe(201);
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
            });

        const articleFoundById = await request(app)
            .get(
                `/articles/${novaNoticiaComDuasTags.body.articleWithRelations.id}`
            )
            .set({ Authorization: `Bearer ${token}` });

        const novaNoticiaComDuasTagsBody = articleFoundById.body;
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

        expect(articleFoundById.body.TagsOnArticles[1]).toBe("notícia1");
        expect(articleFoundById.body.TagsOnArticles[0]).toBe(
            "segundaTagNotícia1"
        );
        expect(novaNoticiaComDuasTagsLog.description).toBe(
            "Article created successfully!"
        );

        expect(novaNoticiaComDuasTags.status).toBe(201);

        setTimeout(
            () => expect(articleFoundById.body.TagsOnArticles).toHaveLength(2),
            5000
        );
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
            });

        const articleFoundById = await request(app)
            .get(
                `/articles/${novaNoticiaComUmaCategoria.body.articleWithRelations.id}`
            )
            .set({ Authorization: `Bearer ${token}` });

        const novaNoticiaComUmaCategoriaBody = articleFoundById.body;
        const novaNoticiaComUmaCategoriaLog =
            novaNoticiaComUmaCategoria.body.log;

        expect(novaNoticiaComUmaCategoriaBody).toHaveProperty("id");
        expect(novaNoticiaComUmaCategoriaBody.title).toBe("Primeira notícia");
        expect(novaNoticiaComUmaCategoriaBody.subTitle).toBe(
            "Essa é a primeira notícia criada"
        );
        expect(novaNoticiaComUmaCategoriaBody.content).toBe(
            "conteúdo da prmeira notícia é"
        );
        expect(novaNoticiaComUmaCategoriaBody.isHighlight).toBe(false);
        expect(novaNoticiaComUmaCategoriaBody.CategoryOnArticles).toHaveLength(
            1
        );
        expect(articleFoundById.body.CategoryOnArticles[0]).toBe("test");

        expect(novaNoticiaComUmaCategoriaLog.description).toBe(
            "Article created successfully!"
        );

        expect(novaNoticiaComUmaCategoria.status).toBe(201);
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
            });

        const articleFoundById = await request(app)
            .get(
                `/articles/${novaNoticiaComDuasCategorias.body.articleWithRelations.id}`
            )
            .set({ Authorization: `Bearer ${token}` });

        const novaNoticiaComDuasCategoriasBody = articleFoundById.body;
        const novaNoticiaComDuasTagsLog = novaNoticiaComDuasCategorias.body.log;

        expect(novaNoticiaComDuasCategoriasBody).toHaveProperty("id");
        expect(novaNoticiaComDuasCategoriasBody.title).toBe("Primeira notícia");
        expect(novaNoticiaComDuasCategoriasBody.subTitle).toBe(
            "Essa é a primeira notícia criada"
        );
        expect(novaNoticiaComDuasCategoriasBody.content).toBe(
            "conteúdo da prmeira notícia é"
        );
        expect(novaNoticiaComDuasCategoriasBody.isHighlight).toBe(true);
        expect(
            novaNoticiaComDuasCategoriasBody.CategoryOnArticles
        ).toHaveLength(2);
        expect(articleFoundById.body.CategoryOnArticles[0]).toBe("test");
        expect(articleFoundById.body.CategoryOnArticles[1]).toBe("test 2");

        expect(novaNoticiaComDuasTagsLog.description).toBe(
            "Article created successfully!"
        );

        expect(novaNoticiaComDuasCategorias.status).toBe(201);
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
            });

        const articleFoundById = await request(app)
            .get(
                `/articles/${novaNoticiaComUmTextualGenre.body.articleWithRelations.id}`
            )
            .set({ Authorization: `Bearer ${token}` });

        const novaNoticiaComUmTextualGenreBody = articleFoundById.body;
        const novaNoticiaComUmTextualGenreLog =
            novaNoticiaComUmTextualGenre.body.log;

        expect(novaNoticiaComUmTextualGenreBody).toHaveProperty("id");
        expect(novaNoticiaComUmTextualGenreBody.title).toBe("Primeira notícia");
        expect(novaNoticiaComUmTextualGenreBody.subTitle).toBe(
            "Essa é a primeira notícia criada"
        );
        expect(novaNoticiaComUmTextualGenreBody.content).toBe(
            "conteúdo da prmeira notícia é"
        );
        expect(novaNoticiaComUmTextualGenreBody.isHighlight).toBe(false);
        expect(
            novaNoticiaComUmTextualGenreBody.TextualGenreOnArticles
        ).toHaveLength(1);
        expect(articleFoundById.body.TextualGenreOnArticles[0]).toBe("test");

        expect(novaNoticiaComUmTextualGenreLog.description).toBe(
            "Article created successfully!"
        );

        expect(novaNoticiaComUmTextualGenre.status).toBe(201);
    });

    it("Should be able to create a new article with two textual genre", async () => {
        const novaNoticiaComUmTextualGenre = await request(app)
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
            });

        const articleFoundById = await request(app)
            .get(
                `/articles/${novaNoticiaComUmTextualGenre.body.articleWithRelations.id}`
            )
            .set({ Authorization: `Bearer ${token}` });

        const novaNoticiaComUmTextualGenreBody = articleFoundById.body;
        const novaNoticiaComUmTextualGenreLog =
            novaNoticiaComUmTextualGenre.body.log;

        expect(novaNoticiaComUmTextualGenreBody).toHaveProperty("id");
        expect(novaNoticiaComUmTextualGenreBody.title).toBe("Primeira notícia");
        expect(novaNoticiaComUmTextualGenreBody.subTitle).toBe(
            "Essa é a primeira notícia criada"
        );
        expect(novaNoticiaComUmTextualGenreBody.content).toBe(
            "conteúdo da prmeira notícia é"
        );
        expect(novaNoticiaComUmTextualGenreBody.isHighlight).toBe(true);
        expect(
            novaNoticiaComUmTextualGenreBody.TextualGenreOnArticles
        ).toHaveLength(2);
        expect(articleFoundById.body.TextualGenreOnArticles[0]).toBe("test");
        expect(articleFoundById.body.TextualGenreOnArticles[1]).toBe("test 2");

        expect(novaNoticiaComUmTextualGenreLog.description).toBe(
            "Article created successfully!"
        );

        expect(novaNoticiaComUmTextualGenre.status).toBe(201);
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
            });

        const articleFoundById = await request(app)
            .get(
                `/articles/${novaNoticiaComUmCourse.body.articleWithRelations.id}`
            )
            .set({ Authorization: `Bearer ${token}` });

        const novaNoticiaComUmCourseBody = articleFoundById.body;
        const novaNoticiaComUmCourseLog = novaNoticiaComUmCourse.body.log;

        expect(novaNoticiaComUmCourseBody).toHaveProperty("id");
        expect(novaNoticiaComUmCourseBody.title).toBe("Primeira notícia");
        expect(novaNoticiaComUmCourseBody.subTitle).toBe(
            "Essa é a primeira notícia criada"
        );
        expect(novaNoticiaComUmCourseBody.content).toBe(
            "conteúdo da prmeira notícia é"
        );
        expect(novaNoticiaComUmCourseBody.isHighlight).toBe(false);
        expect(novaNoticiaComUmCourseBody.CoursesOnArticles).toHaveLength(1);
        expect(articleFoundById.body.CoursesOnArticles[0]).toBe("test");

        expect(novaNoticiaComUmCourseLog.description).toBe(
            "Article created successfully!"
        );

        expect(novaNoticiaComUmCourse.status).toBe(201);
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
            });

        const articleFoundById = await request(app)
            .get(
                `/articles/${novaNoticiaComDoisCourses.body.articleWithRelations.id}`
            )
            .set({ Authorization: `Bearer ${token}` });

        const novaNoticiaComDoisCoursesBody = articleFoundById.body;
        const novaNoticiaComDoisCoursesLog = novaNoticiaComDoisCourses.body.log;

        expect(novaNoticiaComDoisCoursesBody).toHaveProperty("id");
        expect(novaNoticiaComDoisCoursesBody.title).toBe("Primeira notícia");
        expect(novaNoticiaComDoisCoursesBody.subTitle).toBe(
            "Essa é a primeira notícia criada"
        );
        expect(novaNoticiaComDoisCoursesBody.content).toBe(
            "conteúdo da prmeira notícia é"
        );
        expect(novaNoticiaComDoisCoursesBody.isHighlight).toBe(false);
        expect(novaNoticiaComDoisCoursesBody.CoursesOnArticles).toHaveLength(2);
        expect(articleFoundById.body.CoursesOnArticles[0]).toBe("test");

        expect(novaNoticiaComDoisCoursesLog.description).toBe(
            "Article created successfully!"
        );

        expect(novaNoticiaComDoisCourses.status).toBe(201);
    });

    it("Should be able to create a new article with one class", async () => {
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
                classes: [class1.body.newClass.id],
            });

        const articleFoundById = await request(app)
            .get(
                `/articles/${novaNoticiaComUmCourse.body.articleWithRelations.id}`
            )
            .set({ Authorization: `Bearer ${token}` });

        const novaNoticiaComUmCourseBody = articleFoundById.body;
        const novaNoticiaComUmCourseLog = novaNoticiaComUmCourse.body.log;

        expect(novaNoticiaComUmCourseBody).toHaveProperty("id");
        expect(novaNoticiaComUmCourseBody.title).toBe("Primeira notícia");
        expect(novaNoticiaComUmCourseBody.subTitle).toBe(
            "Essa é a primeira notícia criada"
        );
        expect(novaNoticiaComUmCourseBody.content).toBe(
            "conteúdo da prmeira notícia é"
        );
        expect(novaNoticiaComUmCourseBody.isHighlight).toBe(false);
        expect(novaNoticiaComUmCourseBody.ClassesOnArticles).toHaveLength(1);
        expect(articleFoundById.body.ClassesOnArticles[0]).toBe(
            "Teste De Class 1"
        );

        expect(novaNoticiaComUmCourseLog.description).toBe(
            "Article created successfully!"
        );

        expect(novaNoticiaComUmCourse.status).toBe(201);
    });

    it("Should be able to create a new article with two classes", async () => {
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
                classes: [class1.body.newClass.id, class2.body.newClass.id],
            });

        const articleFoundById = await request(app)
            .get(
                `/articles/${novaNoticiaComUmCourse.body.articleWithRelations.id}`
            )
            .set({ Authorization: `Bearer ${token}` });

        const novaNoticiaComUmCourseBody = articleFoundById.body;
        const novaNoticiaComUmCourseLog = novaNoticiaComUmCourse.body.log;

        expect(novaNoticiaComUmCourseBody).toHaveProperty("id");
        expect(novaNoticiaComUmCourseBody.title).toBe("Primeira notícia");
        expect(novaNoticiaComUmCourseBody.subTitle).toBe(
            "Essa é a primeira notícia criada"
        );
        expect(novaNoticiaComUmCourseBody.content).toBe(
            "conteúdo da prmeira notícia é"
        );
        expect(novaNoticiaComUmCourseBody.isHighlight).toBe(false);
        expect(novaNoticiaComUmCourseBody.ClassesOnArticles).toHaveLength(2);
        expect(articleFoundById.body.ClassesOnArticles[0]).toBe(
            "Teste De Class 1"
        );

        expect(articleFoundById.body.ClassesOnArticles[1]).toBe(
            "Teste De Class 2"
        );

        expect(novaNoticiaComUmCourseLog.description).toBe(
            "Article created successfully!"
        );

        expect(novaNoticiaComUmCourse.status).toBe(201);
    });

    it("Should be able to create a new article with one author", async () => {
        const novaNoticiaComUmAuthor = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Primeira notícia",
                subTitle: "Essa é a primeira notícia criada",
                content: "conteúdo da prmeira notícia é",
                isHighlight: false,
                tags: ["notícia1"],
                categories: [category1.body.category.id],
                textualGenres: [textualGenre1.body.textualGenre.id],
                courses: [course1.body.course.id],
                classes: [class1.body.newClass.id],
                authors: [author1.body[0].id],
            });

        const articleFoundById = await request(app)
            .get(
                `/articles/${novaNoticiaComUmAuthor.body.articleWithRelations.id}`
            )
            .set({ Authorization: `Bearer ${token}` });

        const novaNoticiaComUmAuthorBody = articleFoundById.body;
        const novaNoticiaComUmAuthorLog = novaNoticiaComUmAuthor.body.log;

        expect(novaNoticiaComUmAuthorBody).toHaveProperty("id");
        expect(novaNoticiaComUmAuthorBody.title).toBe("Primeira notícia");
        expect(novaNoticiaComUmAuthorBody.subTitle).toBe(
            "Essa é a primeira notícia criada"
        );
        expect(novaNoticiaComUmAuthorBody.content).toBe(
            "conteúdo da prmeira notícia é"
        );
        expect(novaNoticiaComUmAuthorBody.isHighlight).toBe(false);
        expect(novaNoticiaComUmAuthorBody.ClassesOnArticles).toHaveLength(1);
        expect(novaNoticiaComUmAuthorBody.AuthorsOnArticles).toHaveLength(1);
        expect(articleFoundById.body.AuthorsOnArticles[0]).toBe("Author 1");

        expect(novaNoticiaComUmAuthorLog.description).toBe(
            "Article created successfully!"
        );

        expect(novaNoticiaComUmAuthor.status).toBe(201);
    });

    it("Should be able to create a new article with two authors", async () => {
        const novaNoticiaComDoisAuthors = await request(app)
            .post("/articles")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                title: "Primeira notícia",
                subTitle: "Essa é a primeira notícia criada",
                content: "conteúdo da prmeira notícia é",
                isHighlight: false,
                tags: ["notícia1"],
                categories: [category1.body.category.id],
                textualGenres: [textualGenre1.body.textualGenre.id],
                courses: [course1.body.course.id],
                classes: [class1.body.newClass.id],
                authors: [author1.body[0].id, author2.body[0].id],
            });

        const articleFoundById = await request(app)
            .get(
                `/articles/${novaNoticiaComDoisAuthors.body.articleWithRelations.id}`
            )
            .set({ Authorization: `Bearer ${token}` });

        const novaNoticiaComDoisAuthorBodys = articleFoundById.body;
        const novaNoticiaComDoisAuthorLogs = novaNoticiaComDoisAuthors.body.log;

        expect(novaNoticiaComDoisAuthorBodys).toHaveProperty("id");
        expect(novaNoticiaComDoisAuthorBodys.title).toBe("Primeira notícia");
        expect(novaNoticiaComDoisAuthorBodys.subTitle).toBe(
            "Essa é a primeira notícia criada"
        );
        expect(novaNoticiaComDoisAuthorBodys.content).toBe(
            "conteúdo da prmeira notícia é"
        );
        expect(novaNoticiaComDoisAuthorBodys.isHighlight).toBe(false);
        expect(novaNoticiaComDoisAuthorBodys.ClassesOnArticles).toHaveLength(1);
        expect(novaNoticiaComDoisAuthorBodys.AuthorsOnArticles).toHaveLength(2);
        expect(articleFoundById.body.AuthorsOnArticles[0]).toBe("Author 1");
        expect(articleFoundById.body.AuthorsOnArticles[1]).toBe("Author 2");

        expect(novaNoticiaComDoisAuthorLogs.description).toBe(
            "Article created successfully!"
        );

        expect(novaNoticiaComDoisAuthors.status).toBe(201);
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
