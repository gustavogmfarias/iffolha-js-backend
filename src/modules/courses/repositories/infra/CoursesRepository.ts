import { Course, CoursesOnArticles, SchoolLevel } from "@prisma/client";
/* eslint-disable no-restricted-syntax */
import { ArticleWithRelations } from "@modules/articles/repositories/IArticleRepository";

import { prisma } from "@shared/database/prismaClient";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { ICoursesRepository } from "../ICoursesRepository";

export class CoursesRepository implements ICoursesRepository {
    async createCourse(name: string, schoolLevelId: string): Promise<Course> {
        const course = await prisma.course.create({
            data: { name, schoolLevelId },
        });

        return course;
    }

    async update(
        id: string,
        name: string,
        schoolLevelId: string
    ): Promise<Course> {
        const course = await prisma.course.update({
            where: { id },
            data: { name, schoolLevelId },
        });

        return course;
    }

    async deleteCourse(id: string): Promise<void> {
        await prisma.course.delete({
            where: { id },
        });
    }

    async deleteAllCoursesFromArticle(articleId: string): Promise<void> {
        await prisma.coursesOnArticles.deleteMany({
            where: { articleId },
        });
    }

    async findCourseById(id: string): Promise<Course> {
        const course = await prisma.course.findUnique({
            where: { id },
        });

        return course;
    }

    async findCoursesByIds(id: string[]): Promise<Course[]> {
        const courses = await prisma.course.findMany({
            where: { id: { in: id } },
        });

        return courses;
    }

    async findCourseByName(name: string): Promise<Course> {
        const course = await prisma.course.findUnique({
            where: { name },
        });

        return course;
    }

    async listCourses(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<Course[]> {
        let courses: Course[];

        // se não tiver os 3
        if (!page && !perPage && !name) {
            courses = await prisma.course.findMany({
                orderBy: {
                    name: "asc",
                },
                include: {
                    schoolLevel: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
        } else if (page && perPage && !name) {
            courses = await prisma.course.findMany({
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    name: "asc",
                },
                include: {
                    schoolLevel: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
        } else if (!page && !page && name) {
            courses = await prisma.course.findMany({
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
                    schoolLevel: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
        } else {
            courses = await prisma.course.findMany({
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

        return courses;
    }

    async listCoursesByLevel(
        { page, perPage }: IPaginationRequestDTO,
        schoolLevelId: string
    ): Promise<Course[]> {
        let courses: Course[];

        // se não tiver os 3
        if (!page && !perPage && !schoolLevelId) {
            courses = await prisma.course.findMany({
                orderBy: {
                    name: "asc",
                },
            });
        } else if (page && perPage && !schoolLevelId) {
            courses = await prisma.course.findMany({
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    name: "asc",
                },
            });
        } else if (!page && !page && schoolLevelId) {
            courses = await prisma.course.findMany({
                where: {
                    schoolLevelId: {
                        equals: schoolLevelId,
                    },
                },
                orderBy: {
                    name: "asc",
                },
            });
        } else {
            courses = await prisma.course.findMany({
                where: {
                    schoolLevelId: {
                        equals: schoolLevelId,
                    },
                },
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    name: "asc",
                },
            });
        }

        return courses;
    }

    async listAllCoursesOnArticle(
        articleId: string
    ): Promise<CoursesOnArticles[]> {
        let coursesOnArticles;

        if (articleId) {
            coursesOnArticles = await prisma.coursesOnArticles.findMany({
                where: { articleId },
            });
            return coursesOnArticles;
        }

        coursesOnArticles = await prisma.coursesOnArticles.findMany();

        return coursesOnArticles;
    }

    async listArticlesByCourse(
        { page, perPage }: IPaginationRequestDTO,
        courseName: string,
        articleTitle?: string
    ): Promise<ArticleWithRelations[]> {
        let articles: ArticleWithRelations[];

        if (!page && !perPage && articleTitle && courseName) {
            articles = await prisma.article.findMany({
                where: {
                    title: { contains: articleTitle },
                    CoursesOnArticles: {
                        some: {
                            course: {
                                name: { contains: courseName },
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
        } else if (!page && !perPage && !articleTitle && courseName) {
            articles = await prisma.article.findMany({
                where: {
                    CoursesOnArticles: {
                        some: {
                            course: {
                                name: { contains: courseName },
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
        } else if (page && perPage && !articleTitle && courseName) {
            articles = await prisma.article.findMany({
                where: {
                    CoursesOnArticles: {
                        some: {
                            course: {
                                name: { contains: courseName },
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
                    CoursesOnArticles: {
                        some: {
                            course: {
                                name: { contains: courseName },
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

    async totalCourses(): Promise<number> {
        const courses = await prisma.course.findMany({});

        return courses.length;
    }

    async addCoursesToArticle(
        articleId: string,
        coursesId: string[]
    ): Promise<void> {
        const coursesData = [];
        coursesId.map((classFound) => {
            return coursesData.push({
                articleId,
                classId: classFound,
            });
        });

        for (const courseFound of coursesData) {
            // eslint-disable-next-line no-await-in-loop
            await prisma.coursesOnArticles.create({
                data: {
                    articleId: courseFound.articleId,
                    courseId: courseFound.classId,
                },
            });
        }
    }
}
