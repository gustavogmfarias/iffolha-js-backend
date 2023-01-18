import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListArticlesByTextualGenreUseCase } from "./ListArticlesByTextualGenreUseCase";

class ListArticlesByTextualGenreController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listArticlesByTextualGenreUseCase = container.resolve(
            ListArticlesByTextualGenreUseCase
        );
        const { articleTitle, textualGenreName } = request.query;
        const { perPage, page }: IPaginationRequestDTO = request.query;

        const all = await listArticlesByTextualGenreUseCase.execute(
            {
                page,
                perPage,
            },
            String(textualGenreName),
            String(articleTitle)
        );

        return response
            .setHeader("x-total-count", String(all.totalCount))
            .json(all.articles)
            .send();
    }
}

export { ListArticlesByTextualGenreController };
