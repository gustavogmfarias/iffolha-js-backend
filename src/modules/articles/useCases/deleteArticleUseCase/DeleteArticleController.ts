import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteArticleUseCase } from "./DeleteArticleUseCase";

class DeleteArticleController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: articleToDelete } = request.params;
        const { id: userAdminId } = request.user;
        const deleteUserUseCase = container.resolve(DeleteArticleUseCase);

        const userDeleted = await deleteUserUseCase.execute(
            userAdminId,
            articleToDelete
        );

        return response.status(200).json(userDeleted).send();
    }
}

export { DeleteArticleController };
