import { ArticleWithRelations } from "@modules/articles/repositories/IArticleRepository";
import { Category, CategoryOnArticles } from "@prisma/client";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";

export interface ICategoriesRepository {
    createCategory(name: string): Promise<Category>;
    deleteCategory(id: string): Promise<void>;
    findCategoryByName(name: string): Promise<Category>;
    findCategoryById(id: string): Promise<Category>;
    findCategoriesByIds(id: string[]): Promise<Category[]>;
    listAllCategoriesOnArticle(
        articleId?: string
    ): Promise<CategoryOnArticles[]>;
    listArticlesByCategory(
        { page, perPage }: IPaginationRequestDTO,
        categoryName: string,
        articleTitle?: string
    ): Promise<ArticleWithRelations[]>;
    addCategoriesToArticle(
        articleId: string,
        categoriesId: string[]
    ): Promise<void>;
    totalCategories(): Promise<number>;
    listCategories(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<Category[]>;
}
