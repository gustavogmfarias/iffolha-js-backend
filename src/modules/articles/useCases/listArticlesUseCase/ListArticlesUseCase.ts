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
        const TagsNameOfThisArticle: string[] = [];
        const allArticlsDTO: IArticleResponseDTO[] = [];
        const TagsIdsOfThisArticle = [];

        const articles: Article[] = await this.articleRepository.list({
            page,
            perPage,
        });

        const allArticlesAndTags =
            await this.tagsRepository.listAllTagsOnArticle();

        const allTags = this.tagsRepository.articles.map((article) => {
            const articleTagFound = allArticlesAndTags.find(
                (ArticleOnTag) => ArticleOnTag.articleId === article.id
            );

            return TagsIdsOfThisArticle.push(articleTagFound);
        });

        // return articlesDTO.push(
        //     this.articleRepository.convertDTO(article, articleTagsName)
        // );

        return articlesDTO;
    }
}
export { ListArticlesUseCase };
