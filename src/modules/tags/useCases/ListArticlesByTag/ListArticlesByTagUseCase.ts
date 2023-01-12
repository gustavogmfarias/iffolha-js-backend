/* eslint-disable no-param-reassign */
import { inject, injectable } from "tsyringe";
import { ITagsRepository } from "@modules/tags/repositories/ITagsRepository";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Article, Tag } from "@prisma/client";

interface IResponse {
    articles: Article[];
    totalCount: number;
}

@injectable()
class ListArticlesByTagUseCase {
    constructor(
        @inject("TagsRepository")
        private tagsRepository: ITagsRepository
    ) {}

    async execute(
        { page, perPage }: IPaginationRequestDTO,
        tagName?: string,
        articleTitle?: string
    ): Promise<IResponse> {
        if (tagName === undefined || tagName === "undefined") {
            tagName = null;
        }
        if (articleTitle === undefined || articleTitle === "undefined") {
            articleTitle = null;
        }

        if (page === undefined) {
            page = null;
        }

        if (perPage === undefined) {
            perPage = null;
        }

        const totalCountArr = await this.tagsRepository.listArticlesByTag(
            {},
            tagName,
            articleTitle
        );
        const articles = await this.tagsRepository.listArticlesByTag(
            {
                page,
                perPage,
            },
            tagName,
            articleTitle
        );

        return { articles, totalCount: totalCountArr.length };
    }
}
export { ListArticlesByTagUseCase };
