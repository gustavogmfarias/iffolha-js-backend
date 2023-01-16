import { IUserResponseDTO } from "@modules/accounts/dtos/IUserResponseDTO";
import { UserMap } from "@modules/accounts/mapper/UserMap";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICategoriesRepository } from "@modules/categories/repositories/ICategoriesRepository";
import { Log, Category, User } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    category: Category;
    log: Log;
}

@injectable()
class DeleteCategoryUseCase {
    constructor(
        @inject("CategoriesRepository")
        private categoriesRepository: ICategoriesRepository,
        @inject("LogProvider")
        private logProvider: ILogProvider
    ) {}

    async execute(
        userAdminId: string,
        categoryToDeleteId: string
    ): Promise<IResponse> {
        const category = await this.categoriesRepository.findCategoryById(
            categoryToDeleteId
        );

        if (!category) {
            throw new AppError("Category doesn't exists", 404);
        }
        let categoryDeleted;

        try {
            categoryDeleted =
                this.categoriesRepository.deleteCategory(categoryToDeleteId);
        } catch (err) {
            throw new AppError("Category wasn't deleted", 401);
        }

        const log = await this.logProvider.create({
            logRepository: "CATEGORY",
            description: `Category successfully deleted!`,
            previousContent: JSON.stringify(category),
            contentEdited: JSON.stringify(category),
            editedByUserId: userAdminId,
            modelEditedId: category.id,
        });

        return { category, log };
    }
}

export { DeleteCategoryUseCase };
