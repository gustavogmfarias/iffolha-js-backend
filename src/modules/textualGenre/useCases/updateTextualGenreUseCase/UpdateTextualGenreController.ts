import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateTextualGenreUseCase } from "./UpdateTextualGenreUseCase";

class UpdateTextualGenreController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: userAdminId } = request.user;
        const { id: textualGenreId } = request.params;

        const { name } = request.body;

        const updateTextualGenreUseCase = container.resolve(
            UpdateTextualGenreUseCase
        );

        const textualGenre = await updateTextualGenreUseCase.execute(
            textualGenreId,
            name,
            userAdminId
        );

        return response.status(201).send(textualGenre);
    }
}

export { UpdateTextualGenreController };
