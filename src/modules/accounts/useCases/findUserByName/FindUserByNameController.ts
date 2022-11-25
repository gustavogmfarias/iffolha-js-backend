import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindUserByNameUseCase } from "./FindUserByNameUseCase";

interface IRequest {
    page?: number;
    perPage?: number;
    name?: string;
}

class FindUserByNameController {
    async handle(request: Request, response: Response): Promise<Response> {
        const findUserByNameUseCase = container.resolve(FindUserByNameUseCase);

        const { name }: IRequest = request.query;

        const { page, perPage }: IRequest = request.query;

        const all = await findUserByNameUseCase.execute(name, {
            page,
            perPage,
        });

        return response.json(all);
    }
}

export { FindUserByNameController };
