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
        const articles: Article[] = await this.articleRepository.list({
            page,
            perPage,
        });
        const articlesDTO: IArticleResponseDTO[] = [];

        articles.map((article) => {
            const TagsOnArticle: string[] = [];
            const AuthorsOnArticle: string[] = [];

            article.TagsOnArticles.map((data) => {
                const tagName = data.tag.name;

                TagsOnArticle.push(data.tag.name);
            });

            article.AuthorsOnArticles.map((data) => {
                const authorName = data.author.name;
                AuthorsOnArticle.push(authorName);
            });

            const articleDTO = this.articleRepository.convertDTO(
                article,
                TagsOnArticle,
                AuthorsOnArticle
            );

            articlesDTO.push(articleDTO);
        });

        return articlesDTO;
    }
}
export { ListArticlesUseCase };
