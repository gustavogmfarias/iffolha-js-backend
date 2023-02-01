import { ArticleWithRelations } from "@modules/articles/repositories/IArticleRepository";
import { Class, ClassOnArticles } from "@prisma/client";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";

export interface IClassesRepository {
    createClass(name: string, courseId: string): Promise<Class>;
    deleteClass(id: string): Promise<void>;
    deleteAllClassesFromArticle(articleId: string): Promise<void>;

    findClassByName(name: string): Promise<Class>;
    findClassById(id: string): Promise<Class>;
    findClassesByIds(id: string[]): Promise<Class[]>;

    listClasses(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<Class[]>;
    listAllClassesOnArticle(articleId?: string): Promise<ClassOnArticles[]>;
    listArticlesByClass(
        { page, perPage }: IPaginationRequestDTO,
        className: string,
        articleTitle?: string
    ): Promise<ArticleWithRelations[]>;
    listClassesByCourse(
        { page, perPage }: IPaginationRequestDTO,
        courseId: string
    ): Promise<Class[]>;

    totalClasses(): Promise<number>;

    addClassesToArticle(articleId: string, classesId: string[]): Promise<void>;
}
