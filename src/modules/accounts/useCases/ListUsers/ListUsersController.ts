import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListUsersUseCase } from "./ListUsersUseCase";

class ListUsersController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listUsersUseCase = container.resolve(ListUsersUseCase);
        const { name } = request.query;
        const { perPage, page }: IPaginationRequestDTO = request.query;

        const all = await listUsersUseCase.execute(String(name), {
            page,
            perPage,
        });

        return response
            .setHeader("x-total-count", String(all.length))
            .json(all);
    }
}

export { ListUsersController };
