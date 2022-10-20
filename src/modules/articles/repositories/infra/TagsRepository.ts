import { Tag, TagsOnArticles } from "@prisma/client";
import { prisma } from "@shared/database/prismaClient";
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

    async findTagsByIds(id: string[]): Promise<Tag[]> {
        const tags = await prisma.tag.findMany({ where: { id: { in: id } } });

        return tags;
    }

    async findTagByName(name: string): Promise<Tag> {
        const tag = await prisma.tag.findUnique({ where: { name } });

        return tag;
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

    async addTagsToArticle(articleId: string, tagId: string): Promise<void> {
        await prisma.tagsOnArticles.create({
            data: {
                articleId,
                tagId,
            },
        });
    }
}
