/* eslint-disable array-callback-return */
/* eslint-disable no-return-await */
import { inject, injectable } from "tsyringe";
import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import { IArticleRepository } from "@modules/articles/repositories/IArticleRepository";
import { Article, TagsOnArticles } from "@prisma/client";
import { IArticleResponseDTO } from "@modules/articles/dtos/IArticleResponseDTO";
import { ITagsRepository } from "@modules/articles/repositories/ITagsRepository";

@injectable()
class ListArticlesUseCase {
    constructor(
        @inject("ArticleRepository")
        private articleRepository: IArticleRepository,
        @inject("TagsRepository")
        private tagsRepository: ITagsRepository
    ) {}

    async execute({
        page,
        perPage,
    }: IPaginationRequestDTO): Promise<IArticleResponseDTO[]> {
        const TagsIdsOfThisArticle: string[] = [];
        const articlesDTO: IArticleResponseDTO[] = [];

        const articles: Article[] = await this.articleRepository.list({
            page,
            perPage,
        });

        const allArticlesAndTags =
            await this.tagsRepository.listAllTagsOnArticle();

        articles.map((article) => {
            const articleTagFoundById = allArticlesAndTags.map((ArticleOnTag) =>
                ArticleOnTag.articleId === article.id
                    ? TagsIdsOfThisArticle.push(ArticleOnTag.tagId)
                    : null
            );
        });

        const tagsOfTheArticle = await this.tagsRepository.findTagsByIds(
            TagsIdsOfThisArticle
        );

        const tagsNameOfTheArticle = tagsOfTheArticle.map((tag) => {
            return tag.name;
        });

        articlesDTO.push(
            this.articleRepository.convertDTO(article, tagsNameOfTheArticle)
        );
        return articlesDTO;
    }
}
export { ListArticlesUseCase };
