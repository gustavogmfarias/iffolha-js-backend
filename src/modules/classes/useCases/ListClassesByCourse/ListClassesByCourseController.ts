import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListClassesByCourseUseCase } from "./ListClassesByCourseUseCase";

class ListClassesByCourseController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listClassesByCourseUseCase = container.resolve(
            ListClassesByCourseUseCase
        );
        const { courseId } = request.query;
        const { perPage, page }: IPaginationRequestDTO = request.query;

        const all = await listClassesByCourseUseCase.execute(
            {
                page,
                perPage,
            },
            String(courseId)
        );

        return response
            .setHeader("x-total-count", String(all.totalCount))
            .json(all.classes)
            .send();
    }
}

export { ListClassesByCourseController };
