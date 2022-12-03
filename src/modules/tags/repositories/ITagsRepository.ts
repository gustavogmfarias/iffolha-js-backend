import { Tag, TagsOnArticles } from "@prisma/client";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";

export interface ITagsRepository {
    createTag(name: string): Promise<Tag>;
    deleteTag(name: string): Promise<void>;
    findTagByName(name: string): Promise<Tag>;
    findTagById(id: string): Promise<Tag>;
    findTagsByIds(id: string[]): Promise<Tag[]>;
    listTags(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<Tag[]>;
    totalTags(): Promise<number>;
    listAllTagsOnArticle(articleId?: string): Promise<TagsOnArticles[]>;
    addTagsToArticle(articleId: string, tagName: string): Promise<void>;
}
