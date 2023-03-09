import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateCategoryUseCase } from "./UpdateCategoryUseCase";

class UpdateCategoryController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: categoryId } = request.params;
        const { id: userAdminId } = request.user;

        const { name } = request.body;

        const updateCategoryUseCase = container.resolve(UpdateCategoryUseCase);

        const category = await updateCategoryUseCase.execute(
            categoryId,
            name,
            userAdminId
        );

        return response.status(201).send(category);
    }
}

export { UpdateCategoryController };
