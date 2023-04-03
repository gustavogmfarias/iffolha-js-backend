import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import { Article, Prisma } from "@prisma/client";
import { IArticleResponseDTO } from "../dtos/IArticleResponseDTO";
import { ICreateArticleDTO } from "../dtos/ICreateArticleDTO";

export type ArticleWithRelations = Prisma.ArticleGetPayload<{
    include: {
        TagsOnArticles: {
            include: {
                tag: {
                    select: {
                        name: true;
                    };
                };
            };
        };
        AuthorsOnArticles: {
            include: {
                author: {
                    select: {
                        name: true;
                        lastName: true;
                        id: true;
                    };
                };
            };
        };
        CoursesOnArticles: { include: { course: true } };
        ClassOnArticles: { include: { class: true } };
        CategoryOnArticles: { include: { category: true } };
        TextualGenreOnArticles: { include: { textualGenre: true } };
        images: true;
    };
}>;
export interface IArticleRepository {
    create(data: ICreateArticleDTO): Promise<ArticleWithRelations>;
    update(id: string, data: ICreateArticleDTO): Promise<Article>;
    delete(id: string): Promise<Article>;
    findById(id: string): Promise<ArticleWithRelations | null>;
    list(
        { page, perPage }: IPaginationRequestDTO,
        title?: string,
        startDate?: string,
        endDate?: string
    ): Promise<ArticleWithRelations[]>;
    convertDTO(
        article: Article,
        tags: string[],
        authors: string[],
        courses: string[],
        classes: string[],
        categories: string[],
        textualGenres: string[],
        images: string[]
    ): IArticleResponseDTO;
    generateUrl(title: string): string;
    generateContentSummary(content: string): string;
    saveImageOnArticle(
        articleId: string,
        image: string,
        isMain: boolean
    ): Promise<void>;
    imageUrl(image: string): string;
}
