import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListArticlesUseCase } from "./ListArticlesUseCase";

class ListArticlesController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listArticlesUseCase = container.resolve(ListArticlesUseCase);
        const { perPage, page }: IPaginationRequestDTO = request.query;
        const { title, startDate, endDate } = request.query;

        const all = await listArticlesUseCase.execute(
            { page, perPage },
            String(title),
            String(startDate),
            String(endDate)
        );

        return response
            .setHeader("x-total-count", String(all.totalCount))
            .json(all.articles)
            .status(200);
    }
}

export { ListArticlesController };
