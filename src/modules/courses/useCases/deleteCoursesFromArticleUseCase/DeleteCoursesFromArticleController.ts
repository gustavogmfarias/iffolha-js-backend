import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteTextualGenresFromArticleUseCase } from "./DeleteTextualGenreFromArticleUseCase";

class DeleteTextualGenresFromArticleController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { articleId } = request.body;
        const { id: userAdminId } = request.user;
        const deleteTextualGenresFromArticleUseCase = container.resolve(
            DeleteTextualGenresFromArticleUseCase
        );

        const textualGenresDeleted =
            await deleteTextualGenresFromArticleUseCase.execute(
                userAdminId,
                articleId
            );

        return response.status(200).json(textualGenresDeleted).send();
    }
}

export { DeleteTextualGenresFromArticleController };
