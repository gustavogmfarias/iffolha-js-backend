import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteCategoryUseCase } from "./DeleteCategoryUseCase";

class DeleteCategoryController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: categoryToDeleteId } = request.params;
        const { id: userAdminId } = request.user;
        const deleteCategoryUseCase = container.resolve(DeleteCategoryUseCase);

        const CategoryDeleted = await deleteCategoryUseCase.execute(
            userAdminId,
            categoryToDeleteId
        );

        return response.status(200).json(CategoryDeleted).send();
    }
}

export { DeleteCategoryController };
