import { ArticleWithRelations } from "@modules/articles/repositories/IArticleRepository";
import { Tag, TagsOnArticles } from "@prisma/client";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";

export interface ITagsRepository {
    createTag(name: string): Promise<Tag>;
    deleteTag(name: string): Promise<void>;
    deleteAllTagsFromArticle(articleId: string): Promise<void>;
    findTagByName(name: string): Promise<Tag>;
    findTagById(id: string): Promise<Tag>;
    findTagsByIds(id: string[]): Promise<Tag[]>;
    listTags(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<Tag[]>;
    listArticlesByTag(
        { page, perPage }: IPaginationRequestDTO,
        tagName: string,
        articleTitle?: string
    ): Promise<ArticleWithRelations[]>;
    totalTags(): Promise<number>;
    listAllTagsOnArticle(articleId?: string): Promise<TagsOnArticles[]>;
    addTagsToArticle(articleId: string, tagName: string): Promise<void>;
}
