import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteClassesFromArticleUseCase } from "./DeleteClassesFromArticleUseCase";

class DeleteClassesFromArticleController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { articleId } = request.body;
        const { id: userAdminId } = request.user;
        const deleteClassesFromArticleUseCase = container.resolve(
            DeleteClassesFromArticleUseCase
        );

        const classesDeleted = await deleteClassesFromArticleUseCase.execute(
            userAdminId,
            articleId
        );

        return response.status(200).json(classesDeleted).send();
    }
}

export { DeleteClassesFromArticleController };
