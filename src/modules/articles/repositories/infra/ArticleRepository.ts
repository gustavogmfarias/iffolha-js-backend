/* eslint-disable no-shadow */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import { IArticleResponseDTO } from "@modules/articles/dtos/IArticleResponseDTO";
import { ICreateArticleDTO } from "@modules/articles/dtos/ICreateArticleDTO";
import { ArticleMap } from "@modules/articles/mapper/ArticleMap";
import { Article, Tag, TagsOnArticles } from "@prisma/client";
import { prisma } from "@shared/database/prismaClient";
import {
    ArticleWithRelations,
    IArticleRepository,
} from "../IArticleRepository";

export class ArticleRepository implements IArticleRepository {
    async create({
        title,
        subTitle,
        content,
        publishedByUserId,
        isHighlight,
        url,
        tags,
        courses,
        categories,
        textualGenres,
        authors,
        classes,
    }: ICreateArticleDTO): Promise<ArticleWithRelations> {
        const article = await prisma.article.create({
            data: {
                title,
                subTitle,
                content,
                publishedByUserId,
                isHighlight,
                url,
                TagsOnArticles: {
                    create: tags.map((tag) => ({
                        tag: {
                            connectOrCreate: {
                                where: { name: tag },
                                create: { name: tag },
                            },
                        },
                    })),
                },
                CoursesOnArticles: {
                    create: courses.map((course) => ({
                        course: {
                            connect: {
                                id: course,
                            },
                        },
                    })),
                },
                CategoryOnArticles: {
                    create: categories.map((category) => ({
                        category: {
                            connect: {
                                id: category,
                            },
                        },
                    })),
                },
                TextualGenreOnArticles: {
                    create: textualGenres.map((textualGenre) => ({
                        textualGenre: {
                            connect: {
                                id: textualGenre,
                            },
                        },
                    })),
                },
                AuthorsOnArticles: {
                    create: authors.map((author) => ({
                        author: {
                            connect: {
                                id: author,
                            },
                        },
                    })),
                },
                ClassOnArticles: {
                    create: classes.map((classe) => ({
                        class: {
                            connect: {
                                id: classe,
                            },
                        },
                    })),
                },
            },
            include: {
                TagsOnArticles: {
                    include: {
                        tag: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                AuthorsOnArticles: {
                    include: {
                        author: {
                            select: {
                                name: true,
                                lastName: true,
                                id: true,
                                avatarUrl: true,
                                email: true,
                            },
                        },
                    },
                },
                CoursesOnArticles: { include: { course: true } },
                ClassOnArticles: { include: { class: true } },
                CategoryOnArticles: { include: { category: true } },
                TextualGenreOnArticles: { include: { textualGenre: true } },
            },
        });

        return article;
    }

    async update(data: ICreateArticleDTO): Promise<ArticleWithRelations> {
        // Transaction
        const article = await prisma.$transaction(async (prisma) => {
            // Courses
            await prisma.coursesOnArticles.deleteMany({
                where: {
                    articleId: data.id,
                    courseId: { notIn: data.courses },
                },
            });

            await prisma.coursesOnArticles.createMany({
                data: data.courses.map((courseId) => ({
                    courseId,
                    articleId: data.id,
                })),
                skipDuplicates: true,
            });

            // Classes
            await prisma.classOnArticles.deleteMany({
                where: {
                    articleId: data.id,
                    classId: { notIn: data.classes },
                },
            });

            await prisma.classOnArticles.createMany({
                data: data.classes.map((classId) => ({
                    classId,
                    articleId: data.id,
                })),
                skipDuplicates: true,
            });

            // Tags;
            await prisma.tagsOnArticles.deleteMany({
                where: {
                    articleId: data.id,
                    tag: { name: { notIn: data.tags } },
                },
            });

            await prisma.tag.createMany({
                data: data.tags.map((name) => ({ name })),
                skipDuplicates: true,
            });

            const tagsId = await prisma.tag.findMany({
                where: { name: { in: data.tags } },
            });

            await prisma.tagsOnArticles.createMany({
                data: tagsId.map((tagId) => ({
                    tagId: tagId.id,
                    articleId: data.id,
                })),
                skipDuplicates: true,
            });

            // Categories
            await prisma.categoryOnArticles.deleteMany({
                where: {
                    articleId: data.id,
                    categoryId: { notIn: data.categories },
                },
            });

            await prisma.categoryOnArticles.createMany({
                data: data.categories.map((categoryId) => ({
                    categoryId,
                    articleId: data.id,
                })),
                skipDuplicates: true,
            });

            // Textual Genres
            await prisma.textualGenreOnArticles.deleteMany({
                where: {
                    articleId: data.id,
                    textualGenreId: { notIn: data.textualGenres },
                },
            });

            await prisma.textualGenreOnArticles.createMany({
                data: data.textualGenres.map((textualGenreId) => ({
                    textualGenreId,
                    articleId: data.id,
                })),
                skipDuplicates: true,
            });

            // Authors
            await prisma.authorsOnArticles.deleteMany({
                where: {
                    ArticleId: data.id,
                    authorId: { notIn: data.authors },
                },
            });

            await prisma.authorsOnArticles.createMany({
                data: data.authors.map((authorId) => ({
                    authorId,
                    ArticleId: data.id,
                })),
                skipDuplicates: true,
            });

            const updatedArticle = await prisma.article.update({
                where: { id: data.id },
                include: {
                    TagsOnArticles: {
                        include: {
                            tag: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                    AuthorsOnArticles: {
                        include: {
                            author: {
                                select: {
                                    name: true,
                                    lastName: true,
                                    id: true,
                                    avatarUrl: true,
                                    email: true,
                                },
                            },
                        },
                    },
                    CoursesOnArticles: { include: { course: true } },
                    ClassOnArticles: { include: { class: true } },
                    CategoryOnArticles: { include: { category: true } },
                    TextualGenreOnArticles: { include: { textualGenre: true } },
                },
                data: {
                    editedByUserId: data.editedByUserId,
                    title: data.title,
                    subTitle: data.subTitle,
                    content: data.content,
                    isHighlight: data.isHighlight,
                    updatedDate: new Date(),
                },
            });

            return updatedArticle;
        });

        return article;
    }

    async delete(id: string): Promise<Article> {
        const article = await prisma.article.delete({
            where: { id },
        });

        return article;
    }

    async findById(id: string): Promise<ArticleWithRelations | null> {
        const articleWithRelations = await prisma.article.findUnique({
            where: {
                id,
            },
            include: {
                TagsOnArticles: {
                    include: {
                        tag: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                AuthorsOnArticles: {
                    include: {
                        author: {
                            select: {
                                name: true,
                                lastName: true,
                                id: true,
                                avatarUrl: true,
                                email: true,
                            },
                        },
                    },
                },
                CoursesOnArticles: { include: { course: true } },
                ClassOnArticles: { include: { class: true } },
                CategoryOnArticles: { include: { category: true } },
                TextualGenreOnArticles: { include: { textualGenre: true } },
            },
        });

        return articleWithRelations;
    }

    async list(
        { page, perPage }: IPaginationRequestDTO,
        title?: string,
        startDate?: string,
        endDate?: string
    ): Promise<ArticleWithRelations[]> {
        const where: Record<string, any> = {};

        if (title != null && title !== "undefined") {
            where.title = { contains: title };
        }

        if (startDate != null && startDate !== "undefined") {
            const startOfDay = new Date(startDate);
            startOfDay.setHours(0, 0, 0, 0);

            where.publishedDate = {
                ...(where.publishedDate ?? {}),
                gte: startOfDay,
            };
        }

        if (endDate != null && endDate !== "undefined") {
            const endOfDay = new Date(endDate);
            endOfDay.setHours(23, 59, 59, 999);

            where.publishedDate = {
                ...(where.publishedDate ?? {}),
                lte: endOfDay,
            };
        }

        const articles = await prisma.article.findMany({
            where,
            ...(page && perPage
                ? {
                      take: perPage * 1,
                      skip: (page - 1) * perPage,
                  }
                : {}),
            orderBy: {
                publishedDate: "desc",
            },
            include: {
                TagsOnArticles: {
                    include: {
                        tag: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                AuthorsOnArticles: {
                    include: {
                        author: {
                            select: {
                                name: true,
                                lastName: true,
                                id: true,
                                avatarUrl: true,
                                email: true,
                            },
                        },
                    },
                },
                CoursesOnArticles: { include: { course: true } },
                ClassOnArticles: { include: { class: true } },
                CategoryOnArticles: { include: { category: true } },
                TextualGenreOnArticles: { include: { textualGenre: true } },
            },
        });

        return articles;
    }

    convertDTO(
        article: Article,
        tags: string[],
        authors: string[],
        courses: string[],
        classes: string[],
        categories: string[],
        textualGenres: string[],
        images: string[]
    ): IArticleResponseDTO {
        const articleDTO = ArticleMap.toDTO(
            article,
            tags,
            categories,
            textualGenres,
            authors,
            courses,
            classes,
            images
        );

        return articleDTO;
    }

    public generateUrl(title: string): string {
        const url = title
            .toLowerCase()
            .slice(0, 30)
            .normalize("NFD")
            .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, "")
            .replaceAll(" ", "-");
        return url;
    }

    imageUrl(image: string): string {
        switch (process.env.DISK) {
            case "local":
                return `${process.env.APP_API_URL}/article-images/${image}`;
            case "s3":
                return `${process.env.AWS_BUCKET_URL}/article-images/${image}`;
            default:
                return null;
        }
    }

    generateContentSummary(content: string): string {
        const contentSummary = content.slice(0, 300);
        return contentSummary;
    }
}

/*

CoursesOnArticles: {
                    create: coursesToAdd.map((course) => ({
                        course: {
                            connect: {
                                id: course,
                            },
                            disconnect: {
                                id: coursesToRemove.map(
                                    (courseToDisconnect) => courseToDisconnect
                                ),
                            },
                        },
                    })),
                },

                */
