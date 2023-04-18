import { Request, Response } from "express";
import { container } from "tsyringe";
import { AddImagesArticleUseCase } from "./AddImagesArticleUseCase";

class AddImagesArticleController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.user;
        const { articleId } = request.params;

        const image = request.file.filename;

        const addImagesArticleUseCase = container.resolve(
            AddImagesArticleUseCase
        );

        await addImagesArticleUseCase.execute({
            articleId,
            image,
            isMain: true,
        });

        return response.status(201).send();
    }
}

export { AddImagesArticleController };
