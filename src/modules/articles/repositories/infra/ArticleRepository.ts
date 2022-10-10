import { ICreateArticleDTO } from "@modules/articles/dtos/ICreateArticleDTO";
import { Article } from "@prisma/client";
import { prisma } from "@shared/database/prismaClient";
import { IArticleRepository } from "../IArticleRepository";

export class ArticleRepository implements IArticleRepository {
    async create({
        title,
        subTitle,
        content,
        publishedByUserId,
        isHighlight,
        url,
    }: ICreateArticleDTO): Promise<Article> {
        const article = await prisma.article.create({
            data: {
                title,
                subTitle,
                content,
                publishedByUserId,
                isHighlight,
                url,
            },
        });

        return article;
    }

    generateUrl(title: string): string {
        const url = title.toLowerCase().replaceAll(" ", "-").slice(0, 30);
        return url;
    }

    updateAuthors(articleId: string, authors: string[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    updateImages(articleId: string, images: string[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
