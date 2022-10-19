import { Tag, TagsOnArticles } from "@prisma/client";

export interface ITagsRepository {
    createTag(name: string): Promise<Tag>;
    findTagByName(name: string): Promise<Tag>;
    findTagById(id: string): Promise<Tag>;
    listAllTagsOnArticle(articleId?: string): Promise<TagsOnArticles[]>;
    addTagsToArticle(articleId: string, tagName: string): Promise<void>;
}
