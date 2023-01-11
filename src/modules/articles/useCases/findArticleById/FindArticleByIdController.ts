import { Request, Response } from "express";
import { container } from "tsyringe";
import { FindArticleByIdUseCase } from "./FindArticleByIdUseCase";

class FindArticleByIdController {
    async handle(request: Request, response: Response): Promise<Response> {
        const findArticleByIdUseCase = container.resolve(
            FindArticleByIdUseCase
        );

        const { id } = request.params;

        const all = await findArticleByIdUseCase.execute({ id });

        return response.json(all);
    }
}

export { FindArticleByIdController };
