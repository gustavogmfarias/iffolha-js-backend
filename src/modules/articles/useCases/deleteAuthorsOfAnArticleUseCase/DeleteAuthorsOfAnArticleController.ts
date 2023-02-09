import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteAuthorsOfAnArticleUseCase } from "./DeleteAuthorsOfAnArticleUseCase";

class DeleteAuthorsOfAnArticleController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { articleId } = request.body;
        const { id: userAdminId } = request.user;
        const deleteAuthorsOfAnArticleUseCase = container.resolve(
            DeleteAuthorsOfAnArticleUseCase
        );

        const authorsDeleted = await deleteAuthorsOfAnArticleUseCase.execute(
            userAdminId,
            articleId
        );

        return response.status(200).json(authorsDeleted).send();
    }
}

export { DeleteAuthorsOfAnArticleController };
