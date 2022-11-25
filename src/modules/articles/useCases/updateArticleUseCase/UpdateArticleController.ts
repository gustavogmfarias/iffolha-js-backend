import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateArticleUseCase } from "./UpdateArticleUseCase";

class UpdateArticleController {
    async handle(request: Request, response: Response): Promise<Response> {
        const images = [];

        const { id: userId } = request.user;
        const articleId = String(request.params);
        const {
            title,
            subTitle,
            content,
            isHighlight,
            authors,
            tags,
            courses,
            classes,
        } = request.body;
        const updateArticleUseCase = container.resolve(UpdateArticleUseCase);

        const article = await updateArticleUseCase.execute({
            id: articleId,

            title,
            subTitle,
            content,
            editedByUserId: userId,
            isHighlight,
            authors,
            tags,
            courses,
            classes,
        });

        return response.status(201).send(article);
    }
}

export { UpdateArticleController };
