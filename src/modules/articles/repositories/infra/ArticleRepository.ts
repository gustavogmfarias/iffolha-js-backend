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
                images: true,
            },
        });

        return article;
    }

    async update(
        id,
        {
            title,
            subTitle,
            content,
            editedByUserId,
            isHighlight,
            url,
        }: ICreateArticleDTO
    ): Promise<Article> {
        const article = await prisma.article.update({
            where: id,
            data: {
                title,
                subTitle,
                content,
                editedByUserId,
                isHighlight,
                url,
            },
        });

        return article;
    }

    async delete(id: string): Promise<void> {
        await prisma.article.delete({
            where: { id },
        });
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
                images: true,
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
                images: true,
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

    async saveImageOnArticle(
        articleId: string,
        image: string,
        isMain: boolean
    ): Promise<void> {
        const articleImage = await prisma.articleImages.create({
            data: { image, ArticleId: articleId, isMain },
        });
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
