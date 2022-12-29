import { ICategoriesRepository } from "@modules/category/repositories/ICategoriesRepository";
import { Category, Log } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    category: Category;
    log: Log;
}

@injectable()
class CreateCategoryUseCase {
    constructor(
        @inject("CategoriesRepository")
        private categoriesRepository: ICategoriesRepository,
        @inject("LogProvider") private logProvider: ILogProvider
    ) {}

    async execute(name: string, userAdminId: string): Promise<IResponse> {
        let category = await this.categoriesRepository.findCategoryByName(name);

        if (category) {
            throw new AppError("Category already exists", 400);
        }

        try {
            category = await this.categoriesRepository.createCategory(name);
        } catch (err) {
            throw new AppError(err.message, 400);
        }

        const log = await this.logProvider.create({
            logRepository: "CATEGORY",
            description: `Category created successfully!`,
            previousContent: JSON.stringify(category),
            contentEdited: JSON.stringify(category),
            editedByUserId: userAdminId,
            modelEditedId: category.id,
        });

        return { category, log };
    }
}

export { CreateCategoryUseCase };
