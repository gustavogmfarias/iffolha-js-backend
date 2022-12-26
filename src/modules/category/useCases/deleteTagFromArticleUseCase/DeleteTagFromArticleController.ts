import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteTagFromArticleUseCase } from "./DeleteTagFromArticleUseCase";

class DeleteTagFromArticleController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { articleId } = request.body;
        const { id: userAdminId } = request.user;
        const deleteTagFromArticleUseCase = container.resolve(
            DeleteTagFromArticleUseCase
        );

        const tagsDeleted = await deleteTagFromArticleUseCase.execute(
            userAdminId,
            articleId
        );

        return response.status(200).json(tagsDeleted).send();
    }
}

export { DeleteTagFromArticleController };
