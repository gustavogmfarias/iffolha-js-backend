import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindByNameUseCase } from "./FindByNameUseCase";

interface IRequest {
    page?: number;
    perPage?: number;
    name?: string;
}

class FindByNameController {
    async handle(request: Request, response: Response): Promise<Response> {
        const findByNameUseCase = container.resolve(FindByNameUseCase);

        const { name }: IRequest = request.body;

        const { page, perPage }: IRequest = request.query;

        const all = await findByNameUseCase.execute(name, { page, perPage });

        return response.json(all);
    }
}

export { FindByNameController };
