import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindByNameUseCase } from "./FindByNameUseCase";

interface IRequest {
    page?: number;
    per_page?: number;
    name?: string;
}

class FindByNameController {
    async handle(request: Request, response: Response): Promise<Response> {
        const findByNameUseCase = container.resolve(FindByNameUseCase);

        const { name }: IRequest = request.body;

        const { page, per_page }: IRequest = request.query;

        const all = await findByNameUseCase.execute(name, { page, per_page });

        return response.json(all);
    }
}

export { FindByNameController };
