import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindUserByIdUseCase } from "./FindUserByIdUseCase";

class FindUserByIdController {
    async handle(request: Request, response: Response): Promise<Response> {
        const findUserByIdUseCase = container.resolve(FindUserByIdUseCase);

        const { id } = request.query;

        const all = await findUserByIdUseCase.execute({ id });

        return response.json(all);
    }
}

export { FindUserByIdController };
