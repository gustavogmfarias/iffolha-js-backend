import { ICategoriesRepository } from "@modules/categories/repositories/ICategoriesRepository";
import { Category, Log } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    categoryUpdated: Category;
    log: Log;
}

@injectable()
class UpdateCategoryUseCase {
    constructor(
        @inject("CategoriesRepository")
        private categoriesRepository: ICategoriesRepository,
        @inject("LogProvider") private logProvider: ILogProvider
    ) {}

    async execute(
        id: string,
        name: string,
        userAdminId: string
    ): Promise<IResponse> {
        const category = await this.categoriesRepository.findCategoryByName(
            name
        );

        let categoryUpdated: Category;

        if (category) {
            throw new AppError("Category already exists", 400);
        }

        try {
            categoryUpdated = await this.categoriesRepository.update(id, name);
        } catch (err) {
            throw new AppError(err.message, 400);
        }

        const log = await this.logProvider.create({
            logRepository: "CATEGORY",
            description: `Category updated successfully!`,
            previousContent: JSON.stringify(category),
            contentEdited: JSON.stringify(categoryUpdated),
            editedByUserId: userAdminId,
            modelEditedId: id,
        });

        return { categoryUpdated, log };
    }
}

export { UpdateCategoryUseCase };
