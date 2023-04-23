import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateArticleUseCase } from "./UpdateArticleUseCase";

export interface IUpdateArticleRequest {
    id: string;
    title: string;
    subTitle: string;
    content: string;
    editedByUserId: string;
    isHighlight: boolean;
    authors?: string[];
    tags?: string[];
    courses?: string[];
    classes?: string[];
    categories?: string[];
    textualGenres?: string[];
}

class UpdateArticleController {
    async handle(request: Request, response: Response): Promise<Response> {
        const images = [];

        const { id: userId } = request.user;
        const { articleId } = request.params;
        const data: IUpdateArticleRequest = request.body;
        const updateArticleUseCase = container.resolve(UpdateArticleUseCase);

        const article = await updateArticleUseCase.execute({
            ...data,
            id: articleId,
            editedByUserId: userId,
        });

        return response.status(201).send(article);
    }
}

export { UpdateArticleController };
