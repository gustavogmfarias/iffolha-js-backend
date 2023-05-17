import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListVideoUseCase } from "./ListVideoUseCase";

class ListVideoController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listVideoUseCase = container.resolve(ListVideoUseCase);
        const { description } = request.query;
        const { perPage, page }: IPaginationRequestDTO = request.query;

        const all = await listVideoUseCase.execute(
            {
                page,
                perPage,
            },
            String(description)
        );

        return response
            .setHeader("x-total-count", String(all.totalCount))
            .json(all.videos)
            .send();
    }
}

export { ListVideoController };
