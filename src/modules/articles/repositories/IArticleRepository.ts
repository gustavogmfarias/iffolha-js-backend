import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import { Article } from "@prisma/client";
import { IArticleResponseDTO } from "../dtos/IArticleResponseDTO";
import { ICreateArticleDTO } from "../dtos/ICreateArticleDTO";

export interface IArticleRepository {
    create(data: ICreateArticleDTO): Promise<Article>;
    update(id: string, data: ICreateArticleDTO): Promise<Article>;

    delete(id: string): Promise<void>;

    findById(id: string): Promise<Article | null>;

    list({ page, perPage }: IPaginationRequestDTO): Promise<Article[]>;

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
