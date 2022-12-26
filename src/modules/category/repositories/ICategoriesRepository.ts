import { Category, CategoryOnArticles } from "@prisma/client";

export interface ICategoriesRepository {
    createCategory(name: string): Promise<Category>;
    findCategoryByName(name: string): Promise<Category>;
    findCategoryById(id: string): Promise<Category>;
    findCategoriesByIds(id: string[]): Promise<Category[]>;
    listAllCategoriesOnArticle(
        articleId?: string
    ): Promise<CategoryOnArticles[]>;
    addCategoriesToArticle(
        articleId: string,
        categoriesId: string[]
    ): Promise<void>;
}
