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

    async listTags(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<Tag[]> {
        let tags: Tag[];

        if (!page || !perPage) {
            tags = await prisma.tag.findMany({
                where: {
                    name: {
                        contains: name,
                        mode: "insensitive",
                    },
                },
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
