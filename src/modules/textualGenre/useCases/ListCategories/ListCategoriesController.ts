import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListCategoriesUseCase } from "./ListCategoriesUseCase";

class ListCategoriesController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listCategoriesUseCase = container.resolve(ListCategoriesUseCase);
        const { name } = request.query;
        const { perPage, page }: IPaginationRequestDTO = request.query;

        const all = await listCategoriesUseCase.execute(
            {
                page,
                perPage,
            },
            String(name)
        );

        return response
            .setHeader("x-total-count", String(all.totalCount))
            .json(all.categories)
            .send();
    }
}

export { ListCategoriesController };
