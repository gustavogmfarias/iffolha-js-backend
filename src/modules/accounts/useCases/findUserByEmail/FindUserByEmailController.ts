import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindUserByEmailUseCase } from "./FindUserByEmailUseCase";

interface IRequest {
    email: string;
}

class FindUserByEmailController {
    async handle(request: Request, response: Response): Promise<Response> {
        const findUserByEmailUseCase = container.resolve(
            FindUserByEmailUseCase
        );

        const { email } = request.query;

        const user = await findUserByEmailUseCase.execute({ email });

        return response.json(user);
    }
}

export { FindUserByEmailController };
