import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListUsersUseCase } from "./ListUsersUseCase";

class ListUsersController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listUsersUseCase = container.resolve(ListUsersUseCase);

        const { per_page, page } = request.query;

        const all = await listUsersUseCase.execute({ page, per_page });

        return response.json(all);
    }
}

export { ListUsersController };
