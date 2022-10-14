import { Tag } from "@prisma/client";

export interface ITagsRepository {
    createTag(name: string): Promise<Tag>;
    findTagByName(name: string): Promise<Tag>;
    findTagById(id: string): Promise<Tag>;
    addTagsToArticle(articleId: string, tagName: string): Promise<void>;
}
