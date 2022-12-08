import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListArticlesByTagUseCase } from "./ListArticlesByTagUseCase";

class ListArticlesByTagController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listArticlesByTagUseCase = container.resolve(
            ListArticlesByTagUseCase
        );
        const { articleTitle, tagName } = request.query;
        const { perPage, page }: IPaginationRequestDTO = request.query;

        const all = await listArticlesByTagUseCase.execute(
            {
                page,
                perPage,
            },
            String(tagName),
            String(articleTitle)
        );

        return response
            .setHeader("x-total-count", String(all.totalCount))
            .json(all.articles)
            .send();
    }
}

export { ListArticlesByTagController };
