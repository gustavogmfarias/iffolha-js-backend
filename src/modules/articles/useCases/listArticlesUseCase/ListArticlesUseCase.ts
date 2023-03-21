/* eslint-disable array-callback-return */
/* eslint-disable no-return-await */
import { inject, injectable } from "tsyringe";
import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import {
    ArticleWithRelations,
    IArticleRepository,
} from "@modules/articles/repositories/IArticleRepository";
import { Article, TagsOnArticles } from "@prisma/client";
import { IArticleResponseDTO } from "@modules/articles/dtos/IArticleResponseDTO";
import { ITagsRepository } from "@modules/tags/repositories/ITagsRepository";

interface IResponse {
    articles: ArticleWithRelations[];
    totalCount: number;
}
@injectable()
class ListArticlesUseCase {
    constructor(
        @inject("ArticleRepository")
        private articleRepository: IArticleRepository,
        @inject("TagsRepository")
        private tagsRepository: ITagsRepository
    ) {}

    async execute(
        { page, perPage }: IPaginationRequestDTO,
        title: string,
        startDate: string,
        endDate: string
    ): Promise<IResponse> {
        const articles = await this.articleRepository.list(
            {
                page,
                perPage,
            },
            title,
            startDate,
            endDate
        );

        return { articles, totalCount: articles.length };
    }
}
export { ListArticlesUseCase };
