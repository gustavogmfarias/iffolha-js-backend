/* eslint-disable no-restricted-syntax */
import { ArticleWithRelations } from "@modules/articles/repositories/IArticleRepository";
import { Category, CategoryOnArticles } from "@prisma/client";
import { prisma } from "@shared/database/prismaClient";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { ICategoriesRepository } from "../ICategoriesRepository";

export class CategoriesRepository implements ICategoriesRepository {
    async createCategory(name: string): Promise<Category> {
        const category = await prisma.category.create({
            data: { name },
        });

        return category;
    }

    async deleteCategory(id: string): Promise<void> {
        await prisma.category.delete({
            where: { id },
        });
    }

    async deleteAllCategoriesFromArticle(articleId: string): Promise<void> {
        await prisma.categoryOnArticles.deleteMany({ where: { articleId } });
    }

    async findCategoryById(id: string): Promise<Category> {
        const category = await prisma.category.findUnique({ where: { id } });

        return category;
    }

    async findCategoriesByIds(id: string[]): Promise<Category[]> {
        const categories = await prisma.category.findMany({
            where: { id: { in: id } },
        });

        return categories;
    }

    async findCategoryByName(name: string): Promise<Category> {
        const category = await prisma.category.findUnique({ where: { name } });

        return category;
    }

    async listCategories(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<Category[]> {
        let categories: Category[];

        // se não tiver os 3
        if (!page && !perPage && !name) {
            categories = await prisma.category.findMany({
                orderBy: {
                    name: "asc",
                },
            });
        } else if (page && perPage && !name) {
            categories = await prisma.category.findMany({
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    name: "asc",
                },
            });
        } else if (!page && !page && name) {
            categories = await prisma.category.findMany({
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
            categories = await prisma.category.findMany({
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

        return categories;
    }

    async listAllCategoriesOnArticle(
        articleId: string
    ): Promise<CategoryOnArticles[]> {
        let categoriesOnArticles;

        if (articleId) {
            categoriesOnArticles = await prisma.categoryOnArticles.findMany({
                where: { articleId },
            });
        }

        categoriesOnArticles = await prisma.categoryOnArticles.findMany();

        return categoriesOnArticles;
    }

    async listArticlesByCategory(
        { page, perPage }: IPaginationRequestDTO,
        categoryName: string,
        articleTitle?: string
    ): Promise<ArticleWithRelations[]> {
        let articles: ArticleWithRelations[];

        //
        // page && perPage && articleTitle && categoryName

        if (!page && !perPage && articleTitle && categoryName) {
            articles = await prisma.article.findMany({
                where: {
                    title: { contains: articleTitle },
                    CategoryOnArticles: {
                        some: {
                            category: { name: { contains: categoryName } },
                        },
                    },
                },
                orderBy: {
                    publishedDate: "desc",
                },
                include: {
                    TagsOnArticles: { include: { tag: true } },
                    AuthorsOnArticles: { include: { author: true } },
                    CoursesOnArticles: { include: { course: true } },
                    ClassOnArticles: { include: { class: true } },
                    CategoryOnArticles: { include: { category: true } },
                    TextualGenreOnArticles: { include: { textualGenre: true } },

                    images: true,
                },
            });
        } else if (!page && !perPage && !articleTitle && categoryName) {
            articles = await prisma.article.findMany({
                where: {
                    CategoryOnArticles: {
                        some: {
                            category: { name: { contains: categoryName } },
                        },
                    },
                },
                orderBy: {
                    publishedDate: "desc",
                },
                include: {
                    TagsOnArticles: { include: { tag: true } },
                    AuthorsOnArticles: { include: { author: true } },
                    CoursesOnArticles: { include: { course: true } },
                    ClassOnArticles: { include: { class: true } },
                    CategoryOnArticles: { include: { category: true } },
                    TextualGenreOnArticles: { include: { textualGenre: true } },

                    images: true,
                },
            });
        } else if (page && perPage && !articleTitle && categoryName) {
            articles = await prisma.article.findMany({
                where: {
                    CategoryOnArticles: {
                        some: {
                            category: { name: { contains: categoryName } },
                        },
                    },
                },
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    publishedDate: "desc",
                },
                include: {
                    TagsOnArticles: { include: { tag: true } },
                    AuthorsOnArticles: { include: { author: true } },
                    CoursesOnArticles: { include: { course: true } },
                    ClassOnArticles: { include: { class: true } },
                    CategoryOnArticles: { include: { category: true } },
                    TextualGenreOnArticles: { include: { textualGenre: true } },

                    images: true,
                },
            });
        } else {
            articles = await prisma.article.findMany({
                where: {
                    title: { contains: articleTitle },
                    CategoryOnArticles: {
                        some: {
                            category: { name: { contains: categoryName } },
                        },
                    },
                },
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    publishedDate: "desc",
                },
                include: {
                    TagsOnArticles: { include: { tag: true } },
                    AuthorsOnArticles: { include: { author: true } },
                    CoursesOnArticles: { include: { course: true } },
                    ClassOnArticles: { include: { class: true } },
                    CategoryOnArticles: { include: { category: true } },
                    TextualGenreOnArticles: { include: { textualGenre: true } },

                    images: true,
                },
            });
        }

        return articles;
    }

    async totalCategories(): Promise<number> {
        const categories = await prisma.category.findMany({});

        return categories.length;
    }

    async addCategoriesToArticle(
        articleId: string,
        categoriesId: string[]
    ): Promise<void> {
        const categoriesData = [];
        categoriesId.map((classFound) => {
            return categoriesData.push({
                articleId,
                classId: classFound,
            });
        });

        for (const categoryFound of categoriesData) {
            // eslint-disable-next-line no-await-in-loop
            await prisma.categoryOnArticles.create({
                data: {
                    articleId: categoryFound.articleId,
                    categoryId: categoryFound.classId,
                },
            });
        }
    }
}
