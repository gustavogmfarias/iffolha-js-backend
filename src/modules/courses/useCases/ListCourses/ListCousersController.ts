import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListCoursesUseCase } from "./ListCoursesUseCase";

class ListCoursesController {
    async handle(request: Request, response: Response): Promise<Response> {
        const llistCoursesUseCase = container.resolve(ListCoursesUseCase);
        const { name } = request.query;
        const { perPage, page }: IPaginationRequestDTO = request.query;

        const all = await llistCoursesUseCase.execute(
            {
                page,
                perPage,
            },
            String(name)
        );

        return response
            .setHeader("x-total-count", String(all.totalCount))
            .json(all.courses)
            .send();
    }
}

export { ListCoursesController };
