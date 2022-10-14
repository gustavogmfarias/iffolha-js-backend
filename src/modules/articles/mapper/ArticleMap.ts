import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { User } from "@prisma/client";
import { instanceToInstance } from "class-transformer";
import { inject, injectable } from "tsyringe";
import { IArticleResponseDTO } from "../dtos/IArticleResponseDTO";
import { IArticleRepository } from "../repositories/IArticleRepository";
import { IAuthorsRepository } from "../repositories/IAuthorsRepository";
import { ITagsRepository } from "../repositories/ITagsRepository";

@injectable()
class ArticleMap {
    static async toDTO({
        title,
        subTitle,
        content,
        publishedByUserId,
        isHighlight,
        url,
        TagsOnArticles,
        AuthorsOnArticles,
    }: IArticleResponseDTO): Promise<IArticleResponseDTO> {
        const tags = [];
        const authors = [];

        if (TagsOnArticles) {
            TagsOnArticles.map(async (tag) => {
                const tagFound = await this.tagsRepository.findTagById(
                    tag.tagId
                );

                tags.push(tagFound.name);
            });
        }

        if (AuthorsOnArticles) {
            AuthorsOnArticles.map(async (author) => {
                const authorFound = await this.usersRepository.findById(
                    author.authorId
                );

                tags.push(authorFound.name);
            });
        }

        const article = instanceToInstance({
            title,
            subTitle,
            content,
            publishedByUserId,
            isHighlight,
            url,
            TagsOnArticles: tags,
            AuthorsOnArticles,
        });
        return article;
    }
}

export { ArticleMap };
