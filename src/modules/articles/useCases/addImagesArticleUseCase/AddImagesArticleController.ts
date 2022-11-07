import { Request, Response } from "express";
import { container } from "tsyringe";
import { AddImagesArticleUseCase } from "./AddImagesArticleUseCase";

interface IFiles {
    filename: string;
}
class AddImagesArticleController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.user;
        const images = request.files as IFiles[];
        const isMain = Boolean(request.query);
        const { articleId } = request.params;

        const addImagesArticleUseCase = container.resolve(
            AddImagesArticleUseCase
        );

        const fileNames = images.map((file) => file.filename);

        await addImagesArticleUseCase.execute({
            articleId,
            isMain,
            fileNames,
        });

        return response.status(201).send();
    }
}

export { AddImagesArticleController };
