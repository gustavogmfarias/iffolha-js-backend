import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListTagsUseCase } from "./ListTagsUseCase";

class ListTagsController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listTagsUseCase = container.resolve(ListTagsUseCase);
        const { name } = request.query;
        const { perPage, page }: IPaginationRequestDTO = request.query;

        const all = await listTagsUseCase.execute(
            {
                page,
                perPage,
            },
            String(name)
        );

        return response
            .setHeader("x-total-count", String(all.totalCount))
            .json(all.tags)
            .send();
    }
}

export { ListTagsController };
