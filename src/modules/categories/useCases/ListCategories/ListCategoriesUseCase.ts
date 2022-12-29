import { inject, injectable } from "tsyringe";
import { ICategoriesRepository } from "@modules/category/repositories/ICategoriesRepository";
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
        const categories = await this.categoriesRepository.listCategories(
            {
                page,
                perPage,
            },
            name
        );

        return { categories, totalCount };
    }
}
export { ListCategoriesUseCase };
