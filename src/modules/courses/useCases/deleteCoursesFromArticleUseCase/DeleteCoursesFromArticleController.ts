import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteCoursesFromArticleUseCase } from "./DeleteCoursesFromArticleUseCase";

class DeleteCoursesFromArticleController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { articleId } = request.body;
        const { id: userAdminId } = request.user;
        const deleteCoursesFromArticleUseCase = container.resolve(
            DeleteCoursesFromArticleUseCase
        );

        const coursessDeleted = await deleteCoursesFromArticleUseCase.execute(
            userAdminId,
            articleId
        );

        return response.status(200).json(coursessDeleted).send();
    }
}

export { DeleteCoursesFromArticleController };
