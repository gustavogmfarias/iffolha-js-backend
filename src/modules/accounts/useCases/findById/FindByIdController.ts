import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindByIdUseCase } from "./FindByIdUseCase";

interface IRequest {
    id: string;
}

class FindByIdController {
    async handle(request: Request, response: Response): Promise<Response> {
        const findByIdUseCase = container.resolve(FindByIdUseCase);

        const { id }: IRequest = request.body;

        const all = await findByIdUseCase.execute(id);

        return response.json(all);
    }
}

export { FindByIdController };
