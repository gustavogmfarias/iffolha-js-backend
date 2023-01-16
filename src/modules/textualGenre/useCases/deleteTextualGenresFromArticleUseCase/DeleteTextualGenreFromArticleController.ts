import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteCategoriesFromArticleUseCase } from "./DeleteCategoriesFromArticleUseCase";

class DeleteCategoriesFromArticleController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { articleId } = request.body;
        const { id: userAdminId } = request.user;
        const deleteCategoriesFromArticleUseCase = container.resolve(
            DeleteCategoriesFromArticleUseCase
        );

        const categoriesDeleted =
            await deleteCategoriesFromArticleUseCase.execute(
                userAdminId,
                articleId
            );

        return response.status(200).json(categoriesDeleted).send();
    }
}

export { DeleteCategoriesFromArticleController };
