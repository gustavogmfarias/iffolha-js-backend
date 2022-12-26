import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

class CreateCategoryController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: userAdminId } = request.user;

        const { name } = request.body;

        const createCategoryUseCase = container.resolve(CreateCategoryUseCase);

        const category = await createCategoryUseCase.execute(name, userAdminId);

        return response.status(201).send(category);
    }
}

export { CreateCategoryController };
