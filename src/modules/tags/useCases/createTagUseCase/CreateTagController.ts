import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTagUseCase } from "./CreateTagUseCase";

class CreateTagController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: userAdminId } = request.user;

        const { name } = request.body;

        const createTagUseCase = container.resolve(CreateTagUseCase);

        const tag = createTagUseCase.execute(name, userAdminId);

        return response.status(201).send(tag);
    }
}

export { CreateTagController };
