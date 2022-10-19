/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import { IArticleResponseDTO } from "@modules/articles/dtos/IArticleResponseDTO";
import { ICreateArticleDTO } from "@modules/articles/dtos/ICreateArticleDTO";
import { ArticleMap } from "@modules/articles/mapper/ArticleMap";
import { Article, Tag } from "@prisma/client";
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

    async list(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<Article[]> {
        let articles: Article[];

        if (!page || !perPage) {
            articles = await prisma.article.findMany({
                orderBy: {
                    publishedDate: "desc",
                },
                include: { TagsOnArticles: true, AuthorsOnArticles: true },
            });
        } else {
            articles = await prisma.article.findMany({
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    publishedDate: "desc",
                },
                include: { TagsOnArticles: true, AuthorsOnArticles: true },
            });
        }

        return articles;
    }

    convertDTO(article: Article, tags: string[]): IArticleResponseDTO {
        const articleDTO = ArticleMap.toDTO(article, tags);

        return articleDTO;
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

    updateImages(articleId: string, images: string[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    generateContentSummary(content: string): string {
        const contentSummary = content.slice(0, 300);
        return contentSummary;
    }
}
