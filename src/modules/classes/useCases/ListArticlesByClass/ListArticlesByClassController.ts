import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListArticlesByClassUseCase } from "./ListArticlesByClassUseCase";

class ListArticlesByClassController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listArticlesByClassUseCase = container.resolve(
            ListArticlesByClassUseCase
        );
        const { articleTitle, classId } = request.query;
        const { perPage, page }: IPaginationRequestDTO = request.query;

        const all = await listArticlesByClassUseCase.execute(
            {
                page,
                perPage,
            },
            String(classId),
            String(articleTitle)
        );

        return response
            .setHeader("x-total-count", String(all.totalCount))
            .json(all.articles)
            .send();
    }
}

export { ListArticlesByClassController };
