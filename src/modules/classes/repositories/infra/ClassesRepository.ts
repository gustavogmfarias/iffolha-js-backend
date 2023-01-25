import { Class, ClassOnArticles, SchoolLevel } from "@prisma/client";
/* eslint-disable no-restricted-syntax */
import { ArticleWithRelations } from "@modules/articles/repositories/IArticleRepository";

import { prisma } from "@shared/database/prismaClient";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { IClassesRepository } from "../IClassesRepository";

export class ClassesRepository implements IClassesRepository {
    async createClass(name: string, courseId: string): Promise<Class> {
        const className = await prisma.class.create({
            data: { name, courseId },
            include: {
                course: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return className;
    }

    async deleteClass(id: string): Promise<void> {
        await prisma.class.delete({
            where: { id },
        });
    }

    async deleteAllClassesFromArticle(articleId: string): Promise<void> {
        await prisma.classOnArticles.deleteMany({
            where: { articleId },
        });
    }

    async findClassById(id: string): Promise<Class> {
        const className = await prisma.class.findUnique({
            where: { id },
        });

        return className;
    }

    async findClassesByIds(id: string[]): Promise<Class[]> {
        const classes = await prisma.class.findMany({
            where: { id: { in: id } },
        });

        return classes;
    }

    async findClassByName(name: string): Promise<Class> {
        const className = await prisma.class.findUnique({
            where: { name },
        });

        return className;
    }

    async listClasses(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<Class[]> {
        let classes: Class[];

        // se não tiver os 3
        if (!page && !perPage && !name) {
            classes = await prisma.class.findMany({
                orderBy: {
                    name: "asc",
                },
                include: {
                    course: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
        } else if (page && perPage && !name) {
            classes = await prisma.class.findMany({
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    name: "asc",
                },
                include: {
                    course: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
        } else if (!page && !page && name) {
            classes = await prisma.class.findMany({
                where: {
                    name: {
                        contains: name,
                        mode: "insensitive",
                    },
                },
                orderBy: {
                    name: "asc",
                },
                include: {
                    course: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
        } else {
            classes = await prisma.class.findMany({
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
                include: {
                    course: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
        }

        return classes;
    }

    async listClassesByLevel(
        { page, perPage }: IPaginationRequestDTO,
        courseId: string
    ): Promise<Class[]> {
        let classes: Class[];

        // se não tiver os 3
        if (!page && !perPage && !courseId) {
            classes = await prisma.class.findMany({
                orderBy: {
                    name: "asc",
                },
            });
        } else if (page && perPage && !courseId) {
            classes = await prisma.class.findMany({
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    name: "asc",
                },
            });
        } else if (!page && !page && courseId) {
            classes = await prisma.class.findMany({
                where: {
                    courseId: {
                        equals: courseId,
                    },
                },
                orderBy: {
                    name: "asc",
                },
            });
        } else {
            classes = await prisma.class.findMany({
                where: {
                    courseId: {
                        equals: courseId,
                    },
                },
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    name: "asc",
                },
            });
        }

        return classes;
    }

    async listAllClassesOnArticle(
        articleId: string
    ): Promise<ClassOnArticles[]> {
        let classOnArticles;

        if (articleId) {
            classOnArticles = await prisma.classOnArticles.findMany({
                where: { articleId },
            });
            return classOnArticles;
        }

        classOnArticles = await prisma.classOnArticles.findMany();

        return classOnArticles;
    }

    async listArticlesByClass(
        { page, perPage }: IPaginationRequestDTO,
        className: string,
        articleTitle?: string
    ): Promise<ArticleWithRelations[]> {
        let articles: ArticleWithRelations[];

        if (!page && !perPage && articleTitle && className) {
            articles = await prisma.article.findMany({
                where: {
                    title: { contains: articleTitle },
                    ClassOnArticles: {
                        some: {
                            class: {
                                name: { contains: className },
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
                    ClassOnArticles: { include: { class: true } },
                    CoursesOnArticles: { include: { course: true } },
                    TextualGenreOnArticles: { include: { textualGenre: true } },
                    CategoryOnArticles: { include: { category: true } },

                    images: true,
                },
            });
        } else if (!page && !perPage && !articleTitle && className) {
            articles = await prisma.article.findMany({
                where: {
                    ClassOnArticles: {
                        some: {
                            class: {
                                name: { contains: className },
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
        } else if (page && perPage && !articleTitle && className) {
            articles = await prisma.article.findMany({
                where: {
                    ClassOnArticles: {
                        some: {
                            class: {
                                name: { contains: className },
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
                    ClassOnArticles: {
                        some: {
                            class: {
                                name: { contains: className },
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

    async totalClasses(): Promise<number> {
        const classes = await prisma.class.findMany({});

        return classes.length;
    }

    async addClassesToArticle(
        articleId: string,
        classesId: string[]
    ): Promise<void> {
        const classesData = [];
        classesId.map((classFound) => {
            return classesData.push({
                articleId,
                classId: classFound,
            });
        });

        for (const classFound of classesData) {
            // eslint-disable-next-line no-await-in-loop
            await prisma.classOnArticles.create({
                data: {
                    articleId: classFound.articleId,
                    classId: classFound.classId,
                },
            });
        }
    }
}
