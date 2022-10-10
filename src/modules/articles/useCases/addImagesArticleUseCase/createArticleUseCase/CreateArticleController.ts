import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateArticleUseCase } from "./CreateArticleUseCase";

class CreateArticleController {
    async handle(request: Request, response: Response): Promise<Response> {
        const tags = [];
        const authors = [];
        const images = [];
        const courses = [];
        const classes = [];

        const { id: userAdminId } = request.user;
        const { title, subTitle, content, isHighlight } = request.body;
        const createArticleUseCase = container.resolve(CreateArticleUseCase);

        const article = await createArticleUseCase.execute({
            userAdminId,
            title,
            subTitle,
            content,
            publishedByUserId: userAdminId,
            isHighlight,
        });

        return response.status(201).send(article);
    }
}

export { CreateArticleController };
