/* eslint-disable no-param-reassign */
import { inject, injectable } from "tsyringe";
import { ICategoriesRepository } from "@modules/categories/repositories/ICategoriesRepository";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Category } from "@prisma/client";

interface IResponse {
    categories: Category[];
    totalCount: number;
}

@injectable()
class ListCategoriesUseCase {
    constructor(
        @inject("CategoriesRepository")
        private categoriesRepository: ICategoriesRepository
    ) {}

    async execute(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<IResponse> {
        const totalCount = await this.categoriesRepository.totalCategories();
        let categories: Category[];

        if (name === undefined || name === "undefined") {
            name = null;
        }

        if (page === undefined) {
            page = null;
        }

        if (perPage === undefined) {
            perPage = null;
        }

        if (page && perPage) {
            categories = await this.categoriesRepository.listCategories({
                page,
                perPage,
            });
        }

        if (page && perPage && name) {
            categories = await this.categoriesRepository.listCategories(
                {
                    page,
                    perPage,
                },
                name
            );
        }

        if (!page && !perPage && name) {
            categories = await this.categoriesRepository.listCategories(
                {},
                name
            );
        }

        if (!page && !perPage && !name) {
            categories = await this.categoriesRepository.listCategories(
                {},
                name
            );
        }

        return { categories, totalCount };
    }
}
export { ListCategoriesUseCase };
