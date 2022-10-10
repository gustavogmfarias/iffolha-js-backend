import { Article } from "@prisma/client";
import { ICreateArticleDTO } from "../dtos/ICreateArticleDTO";

export interface IArticleRepository {
    create(data: ICreateArticleDTO): Promise<Article>;

    generateUrl(title: string): string;

    updateAuthors(articleId: string, authors: string[]): Promise<void>;
    updateImages(articleId: string, images: string[]): Promise<void>;
}
