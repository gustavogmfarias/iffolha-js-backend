import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListClassesUseCase } from "./ListClassesUseCase";

class ListClassesController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listClassesUseCase = container.resolve(ListClassesUseCase);
        const { name } = request.query;
        const { perPage, page }: IPaginationRequestDTO = request.query;

        const all = await listClassesUseCase.execute(
            {
                page,
                perPage,
            },
            String(name)
        );

        return response
            .setHeader("x-total-count", String(all.totalCount))
            .json(all.classes)
            .send();
    }
}

export { ListClassesController };
