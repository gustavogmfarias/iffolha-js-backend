import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListArticlesUseCase } from "./ListArticlesUseCase";

class ListArticlesController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listArticlesUseCase = container.resolve(ListArticlesUseCase);
        const { perPage, page }: IPaginationRequestDTO = request.query;

        const all = await listArticlesUseCase.execute({
            page,
            perPage,
        });

        return response.json(all);
    }
}

export { ListArticlesController };
