import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListUsersUseCase } from "./ListUsersUseCase";

class ListUsersController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listUsersUseCase = container.resolve(ListUsersUseCase);

        const { perPage, page } = request.query;

        const all = await listUsersUseCase.execute({ page, perPage });

        return response.json(all);
    }
}

export { ListUsersController };
