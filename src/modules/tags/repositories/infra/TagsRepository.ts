import { ArticleWithRelations } from "@modules/articles/repositories/IArticleRepository";
import { Tag, TagsOnArticles } from "@prisma/client";
import { prisma } from "@shared/database/prismaClient";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { ITagsRepository } from "../ITagsRepository";

export class TagsRepository implements ITagsRepository {
    async createTag(name: string): Promise<Tag> {
        const tag = await prisma.tag.create({
            data: { name },
        });

        return tag;
    }

    async findTagById(id: string): Promise<Tag> {
        const tag = await prisma.tag.findUnique({ where: { id } });

        return tag;
    }

    async deleteTag(name: string): Promise<void> {
        await prisma.tag.delete({
            where: { name },
        });
    }

    async deleteAllTagsFromArticle(articleId: string): Promise<void> {
        await prisma.tagsOnArticles.deleteMany({ where: { articleId } });
    }

    async findTagsByIds(id: string[]): Promise<Tag[]> {
        const tags = await prisma.tag.findMany({ where: { id: { in: id } } });

        return tags;
    }

    async findTagByName(name: string): Promise<Tag> {
        const tag = await prisma.tag.findUnique({ where: { name } });

        return tag;
    }

    async totalTags(): Promise<number> {
        const tags = await prisma.tag.findMany({
            orderBy: {
                name: "asc",
            },
        });

        return tags.length;
    }

    async listAllTagsOnArticle(articleId: string): Promise<TagsOnArticles[]> {
        let tagsOnArticles;

        if (articleId) {
            tagsOnArticles = await prisma.tagsOnArticles.findMany({
                where: { articleId },
            });
        }

        tagsOnArticles = await prisma.tagsOnArticles.findMany();

        return tagsOnArticles;
    }

    async listArticlesByTag(
        { page, perPage }: IPaginationRequestDTO,
        tagName: string,
        articleTitle?: string
    ): Promise<ArticleWithRelations[]> {
        let articles: ArticleWithRelations[];

        if (!page || !perPage || !articleTitle) {
            articles = await prisma.article.findMany({
                where: {
                    title: { contains: articleTitle },
                    TagsOnArticles: {
                        some: { tag: { name: { contains: tagName } } },
                    },
                },
                orderBy: {
                    publishedDate: "desc",
                },
                include: {
                    TagsOnArticles: { include: { tag: true } },
                    AuthorsOnArticles: { include: { author: true } },
                    CoursesOnArticles: { include: { course: true } },
                    ClassOnArticles: { include: { class: true } },
                    CategoryOnArticles: { include: { category: true } },
                    TextualGenreOnArticles: { include: { textualGenre: true } },

                    images: true,
                },
            });
        } else {
            articles = await prisma.article.findMany({
                where: {
                    title: { contains: articleTitle },
                    TagsOnArticles: {
                        some: { tag: { name: { contains: tagName } } },
                    },
                },
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
                    CategoryOnArticles: { include: { category: true } },
                    TextualGenreOnArticles: { include: { textualGenre: true } },

                    images: true,
                },
            });
        }

        return articles;
    }

    async listTags(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<Tag[]> {
        let tags: Tag[];

        if (!page || !perPage || !name) {
            tags = await prisma.tag.findMany({
                orderBy: {
                    name: "asc",
                },
            });
        } else {
            tags = await prisma.tag.findMany({
                where: {
                    name: {
                        contains: name,
                        mode: "insensitive",
                    },
                },
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    name: "asc",
                },
            });
        }

        return tags;
    }

    async addTagsToArticle(articleId: string, tagId: string): Promise<void> {
        await prisma.tagsOnArticles.create({
            data: {
                articleId,
                tagId,
            },
        });
    }
}
