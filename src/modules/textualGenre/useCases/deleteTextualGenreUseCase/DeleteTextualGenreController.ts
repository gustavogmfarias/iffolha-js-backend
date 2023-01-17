import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteTextualGenreUseCase } from "./DeleteTextualGenreUseCase";

class DeleteTextualGenreController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: textualGenreToDeleteId } = request.params;
        const { id: userAdminId } = request.user;
        const deleteTextualGenreUseCase = container.resolve(
            DeleteTextualGenreUseCase
        );

        const TextualGenreDeleted = await deleteTextualGenreUseCase.execute(
            userAdminId,
            textualGenreToDeleteId
        );

        return response.status(200).json(TextualGenreDeleted).send();
    }
}

export { DeleteTextualGenreController };
