import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTextualGenreUseCase } from "./CreateTextualGenreUseCase";

class CreateTextualGenreController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: userAdminId } = request.user;

        const { name } = request.body;

        const createTextualGenreUseCase = container.resolve(
            CreateTextualGenreUseCase
        );

        const textualGenre = await createTextualGenreUseCase.execute(
            name,
            userAdminId
        );

        return response.status(201).send(textualGenre);
    }
}

export { CreateTextualGenreController };
