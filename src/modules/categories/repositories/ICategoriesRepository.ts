import { Category, CategoryOnArticles } from "@prisma/client";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";

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
    totalCategories(): Promise<number>;
    listCategories(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<Category>;
}
