import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import { Article } from "@prisma/client";
import { IArticleResponseDTO } from "../dtos/IArticleResponseDTO";
import { ICreateArticleDTO } from "../dtos/ICreateArticleDTO";

export interface IArticleRepository {
    create(data: ICreateArticleDTO): Promise<Article>;

    list({ page, perPage }: IPaginationRequestDTO): Promise<Article[]>;
    convertDTO(article: Article, tags: string[]): IArticleResponseDTO;

    generateUrl(title: string): string;
    generateContentSummary(content: string): string;

    updateImages(articleId: string, images: string[]): Promise<void>;
}
