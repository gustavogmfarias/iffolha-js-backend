/* eslint-disable no-param-reassign */
import { inject, injectable } from "tsyringe";
import { ICategoriesRepository } from "@modules/categories/repositories/ICategoriesRepository";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Article, Category } from "@prisma/client";

interface IResponse {
    articles: Article[];
    totalCount: number;
}

@injectable()
class ListArticlesByCategoryUseCase {
    constructor(
        @inject("CategoriesRepository")
        private categoriesRepository: ICategoriesRepository
    ) {}

    async execute(
        { page, perPage }: IPaginationRequestDTO,
        categoryName?: string,
        articleTitle?: string
    ): Promise<IResponse> {
        if (categoryName === undefined || categoryName === "undefined") {
            categoryName = null;
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
            await this.categoriesRepository.listArticlesByCategory(
                {},
                categoryName,
                articleTitle
            );
        const articles = await this.categoriesRepository.listArticlesByCategory(
            {
                page,
                perPage,
            },
            categoryName,
            articleTitle
        );

        return { articles, totalCount: totalCountArr.length };
    }
}
export { ListArticlesByCategoryUseCase };
