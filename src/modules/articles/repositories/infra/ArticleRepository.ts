/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { ICreateArticleDTO } from "@modules/articles/dtos/ICreateArticleDTO";
import { Article, User } from "@prisma/client";
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
        const url = title
            .toLowerCase()
            .slice(0, 30)
            .normalize("NFD")
            .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, "")
            .replaceAll(" ", "-");
        return url;
    }

    async updateAuthors(articleId: string, authors: string[]): Promise<void> {
        const newAuthors: User[] = [];

        for (const author in authors) {
            const authorFound = prisma.user.findUnique({
                where: { id: author },
            });

            if (authorFound) {
                newAuthors.push(authorFound);
            }
        }

        const article = await prisma.article.update({
            where: { id: articleId },
            data: {
                AuthorsOnArticles: newAuthors,
            },
        });

        return article;
    }

    updateImages(articleId: string, images: string[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    generateContentSummary(content: string): string {
        const contentSummary = content.slice(0, 300);
        return contentSummary;
    }
}
