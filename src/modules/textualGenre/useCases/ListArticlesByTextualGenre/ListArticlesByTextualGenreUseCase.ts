/* eslint-disable no-param-reassign */
import { inject, injectable } from "tsyringe";
import { ITextualGenreRepository } from "@modules/textualGenre/repositories/ITextualGenreRepository";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Article, TextualGenre } from "@prisma/client";

interface IResponse {
    articles: Article[];
    totalCount: number;
}

@injectable()
class ListArticlesByTextualGenreUseCase {
    constructor(
        @inject("TextualGenreRepository")
        private textualGenreRepository: ITextualGenreRepository
    ) {}

    async execute(
        { page, perPage }: IPaginationRequestDTO,
        textualGenreName?: string,
        articleTitle?: string
    ): Promise<IResponse> {
        if (
            textualGenreName === undefined ||
            textualGenreName === "undefined"
        ) {
            textualGenreName = null;
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

        const totalCountArr =
            await this.textualGenreRepository.listArticlesByTextualGenre(
                {},
                textualGenreName,
                articleTitle
            );
        const articles =
            await this.textualGenreRepository.listArticlesByTextualGenre(
                {
                    page,
                    perPage,
                },
                textualGenreName,
                articleTitle
            );

        return { articles, totalCount: totalCountArr.length };
    }
}
export { ListArticlesByTextualGenreUseCase };
