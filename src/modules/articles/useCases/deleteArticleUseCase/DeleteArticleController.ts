import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteArticleUseCase } from "./DeleteArticleUseCase";

class DeleteArticleController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: articleToDeleteId } = request.params;
        const { id: userAdminId } = request.user;
        const deleteUserUseCase = container.resolve(DeleteArticleUseCase);

        const userDeleted = await deleteUserUseCase.execute(
            userAdminId,
            articleToDeleteId
        );

        return response
            .status(200)
            .json(userDeleted.article)
            .send("Article successfully deleted!");
    }
}

export { DeleteArticleController };
