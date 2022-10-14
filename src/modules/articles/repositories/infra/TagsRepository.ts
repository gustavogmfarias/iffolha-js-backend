import { Tag } from "@prisma/client";
import { prisma } from "@shared/database/prismaClient";
import { ITagsRepository } from "../ITagsRepository";

export class TagsRepository implements ITagsRepository {
    async createTag(name: string): Promise<Tag> {
        const tag = await prisma.tag.create({
            data: { name },
        });

        return tag;
    }

    async findTagByName(name: string): Promise<Tag> {
        const tag = await prisma.tag.findUnique({ where: { name } });

        return tag;
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
