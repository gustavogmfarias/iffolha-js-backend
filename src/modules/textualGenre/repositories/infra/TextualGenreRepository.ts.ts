/* eslint-disable no-restricted-syntax */
import { ArticleWithRelations } from "@modules/articles/repositories/IArticleRepository";
import { TextualGenre, TextualGenreOnArticles } from "@prisma/client";
import { prisma } from "@shared/database/prismaClient";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { ITextualGenreRepository } from "../ITextualGenreRepository";

export class TextualGenreRepository implements ITextualGenreRepository {
    async createTextualGenre(name: string): Promise<TextualGenre> {
        const textualGenre = await prisma.textualGenre.create({
            data: { name },
        });

        return textualGenre;
    }

    async update(id: string, name: string): Promise<TextualGenre> {
        const textualGenre = await prisma.textualGenre.update({
            where: { id },
            data: { name },
        });

        return textualGenre;
    }

    async deleteTextualGenre(id: string): Promise<void> {
        await prisma.textualGenre.delete({
            where: { id },
        });
    }

    async deleteAllTextualGenresFromArticle(articleId: string): Promise<void> {
        await prisma.textualGenreOnArticles.deleteMany({
            where: { articleId },
        });
    }

    async findTextualGenreById(id: string): Promise<TextualGenre> {
        const textualGenre = await prisma.textualGenre.findUnique({
            where: { id },
        });

        return textualGenre;
    }

    async findTextualGenresByIds(id: string[]): Promise<TextualGenre[]> {
        const textualGenres = await prisma.textualGenre.findMany({
            where: { id: { in: id } },
        });

        return textualGenres;
    }

    async findTextualGenreByName(name: string): Promise<TextualGenre> {
        const textualGenre = await prisma.textualGenre.findUnique({
            where: { name },
        });

        return textualGenre;
    }

    async listTextualGenres(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<TextualGenre[]> {
        let textualGenres: TextualGenre[];

        // se não tiver os 3
        if (!page && !perPage && !name) {
            textualGenres = await prisma.textualGenre.findMany({
                orderBy: {
                    name: "asc",
                },
            });
        } else if (page && perPage && !name) {
            textualGenres = await prisma.textualGenre.findMany({
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    name: "asc",
                },
            });
        } else if (!page && !page && name) {
            textualGenres = await prisma.textualGenre.findMany({
                where: {
                    name: {
                        contains: name,
                        mode: "insensitive",
                    },
                },
                orderBy: {
                    name: "asc",
                },
            });
        } else {
            textualGenres = await prisma.textualGenre.findMany({
                where: {
                    name: {
                        contains: name,
                        mode: "insensitive",
                    },
                },
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    name: "asc",
                },
            });
        }

        return textualGenres;
    }

    async listAllTextualGenresOnArticle(
        articleId: string
    ): Promise<TextualGenreOnArticles[]> {
        let textualGenresOnArticles;

        if (articleId) {
            textualGenresOnArticles =
                await prisma.textualGenreOnArticles.findMany({
                    where: { articleId },
                });
        }

        textualGenresOnArticles =
            await prisma.textualGenreOnArticles.findMany();

        return textualGenresOnArticles;
    }

    async listArticlesByTextualGenre(
        { page, perPage }: IPaginationRequestDTO,
        textualGenreName: string,
        articleTitle?: string
    ): Promise<ArticleWithRelations[]> {
        let articles: ArticleWithRelations[];

        if (!page && !perPage && articleTitle && textualGenreName) {
            articles = await prisma.article.findMany({
                where: {
                    title: { contains: articleTitle },
                    TextualGenreOnArticles: {
                        some: {
                            textualGenre: {
                                name: { contains: textualGenreName },
                            },
                        },
                    },
                },
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
                                },
                            },
                        },
                    },
                    CoursesOnArticles: { include: { course: true } },
                    ClassOnArticles: { include: { class: true } },
                    TextualGenreOnArticles: { include: { textualGenre: true } },
                    CategoryOnArticles: { include: { category: true } },

                    images: true,
                },
            });
        } else if (!page && !perPage && !articleTitle && textualGenreName) {
            articles = await prisma.article.findMany({
                where: {
                    TextualGenreOnArticles: {
                        some: {
                            textualGenre: {
                                name: { contains: textualGenreName },
                            },
                        },
                    },
                },
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
                                },
                            },
                        },
                    },
                    CoursesOnArticles: { include: { course: true } },
                    ClassOnArticles: { include: { class: true } },
                    TextualGenreOnArticles: { include: { textualGenre: true } },
                    CategoryOnArticles: { include: { category: true } },

                    images: true,
                },
            });
        } else if (page && perPage && !articleTitle && textualGenreName) {
            articles = await prisma.article.findMany({
                where: {
                    TextualGenreOnArticles: {
                        some: {
                            textualGenre: {
                                name: { contains: textualGenreName },
                            },
                        },
                    },
                },
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
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
                                },
                            },
                        },
                    },
                    CoursesOnArticles: { include: { course: true } },
                    ClassOnArticles: { include: { class: true } },
                    TextualGenreOnArticles: { include: { textualGenre: true } },
                    CategoryOnArticles: { include: { category: true } },

                    images: true,
                },
            });
        } else {
            articles = await prisma.article.findMany({
                where: {
                    title: { contains: articleTitle },
                    TextualGenreOnArticles: {
                        some: {
                            textualGenre: {
                                name: { contains: textualGenreName },
                            },
                        },
                    },
                },
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
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
                                },
                            },
                        },
                    },
                    CoursesOnArticles: { include: { course: true } },
                    ClassOnArticles: { include: { class: true } },
                    TextualGenreOnArticles: { include: { textualGenre: true } },
                    CategoryOnArticles: { include: { category: true } },

                    images: true,
                },
            });
        }

        return articles;
    }

    async totalTextualGenres(): Promise<number> {
        const textualGenres = await prisma.textualGenre.findMany({});

        return textualGenres.length;
    }

    async addTextualGenresToArticle(
        articleId: string,
        textualGenresId: string[]
    ): Promise<void> {
        const textualGenresData = [];
        textualGenresId.map((classFound) => {
            return textualGenresData.push({
                articleId,
                classId: classFound,
            });
        });

        for (const textualGenreFound of textualGenresData) {
            // eslint-disable-next-line no-await-in-loop
            await prisma.textualGenreOnArticles.create({
                data: {
                    articleId: textualGenreFound.articleId,
                    textualGenreId: textualGenreFound.classId,
                },
            });
        }
    }
}
