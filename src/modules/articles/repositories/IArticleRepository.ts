import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import { Article } from "@prisma/client";
import { ICreateArticleDTO } from "../dtos/ICreateArticleDTO";

export interface IArticleRepository {
    create(data: ICreateArticleDTO): Promise<Article>;

    list({ page, perPage }: IPaginationRequestDTO): Promise<Article[]>;

    generateUrl(title: string): string;
    generateContentSummary(content: string): string;

    updateImages(articleId: string, images: string[]): Promise<void>;
}
