import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListCoursesByLevelUseCase } from "./ListCoursesByLevelUseCase";

class ListCoursesByLevelController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listCoursesByLevelUseCase = container.resolve(
            ListCoursesByLevelUseCase
        );
        const { level } = request.query;
        const { perPage, page }: IPaginationRequestDTO = request.query;

        const all = await listCoursesByLevelUseCase.execute(
            {
                page,
                perPage,
            },
            String(level)
        );

        return response
            .setHeader("x-total-count", String(all.totalCount))
            .json(all.courses)
            .send();
    }
}

export { ListCoursesByLevelController };
