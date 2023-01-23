import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListArticlesByCourseUseCase } from "./ListArticlesByCourseUseCase";

class ListArticlesByCourseController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listArticlesByCourseUseCase = container.resolve(
            ListArticlesByCourseUseCase
        );
        const { articleTitle, courseName } = request.query;
        const { perPage, page }: IPaginationRequestDTO = request.query;

        const all = await listArticlesByCourseUseCase.execute(
            {
                page,
                perPage,
            },
            String(courseName),
            String(articleTitle)
        );

        return response
            .setHeader("x-total-count", String(all.totalCount))
            .json(all.articles)
            .send();
    }
}

export { ListArticlesByCourseController };
