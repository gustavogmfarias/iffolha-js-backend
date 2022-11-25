/* eslint-disable no-restricted-syntax */
import { Category, CategoryOnArticles } from "@prisma/client";
import { prisma } from "@shared/database/prismaClient";
import { ICategoriesRepository } from "../ICategoriesRepository";

export class CategoriesRepository implements ICategoriesRepository {
    async createCategory(name: string): Promise<Category> {
        const category = await prisma.category.create({
            data: { name },
        });

        return category;
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
