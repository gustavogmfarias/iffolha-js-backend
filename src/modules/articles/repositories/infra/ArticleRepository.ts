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
                include: {
                    TagsOnArticles: { include: { tag: true } },
                    AuthorsOnArticles: { include: { author: true } },
                    CoursesOnArticles: { include: { course: true } },
                    ClassOnArticles: { include: { class: true } },
                    images: true,
                },
            });
        } else {
            articles = await prisma.article.findMany({
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    publishedDate: "desc",
                },
                include: {
                    TagsOnArticles: { include: { tag: true } },
                    AuthorsOnArticles: { include: { author: true } },
                    CoursesOnArticles: { include: { course: true } },
                    ClassOnArticles: { include: { class: true } },
                    images: true,
                },
            });
        }

        return articles;
    }

    convertDTO(
        article: Article,
        tags: string[],
        authors: string[],
        courses: string[],
        classes: string[],
        images: string[]
    ): IArticleResponseDTO {
        const articleDTO = ArticleMap.toDTO(
            article,
            tags,
            authors,
            courses,
            classes,
            images
        );

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

    async saveImageOnArticle(
        articleId: string,
        image: string,
        isMain: boolean
    ): Promise<void> {
        const articleImage = await prisma.articleImages.create({
            data: { image, ArticleId: articleId, isMain },
        });
    }

    imageUrl(image: string): string {
        switch (process.env.DISK) {
            case "local":
                return `${process.env.APP_API_URL}/article-images/${image}`;
            case "s3":
                return `${process.env.AWS_BUCKET_URL}/article-images/${image}`;
            default:
                return null;
        }
    }

    generateContentSummary(content: string): string {
        const contentSummary = content.slice(0, 300);
        return contentSummary;
    }
}
