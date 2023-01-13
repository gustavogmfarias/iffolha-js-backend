import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListArticlesByCategoryUseCase } from "./ListArticlesByCategoryUseCase";

class ListArticlesByCategoryController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listArticlesByCategoryUseCase = container.resolve(
            ListArticlesByCategoryUseCase
        );
        const { articleTitle, categoryName } = request.query;
        const { perPage, page }: IPaginationRequestDTO = request.query;

        const all = await listArticlesByCategoryUseCase.execute(
            {
                page,
                perPage,
            },
            String(categoryName),
            String(articleTitle)
        );

        return response
            .setHeader("x-total-count", String(all.totalCount))
            .json(all.articles)
            .send();
    }
}

export { ListArticlesByCategoryController };
