import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListSchoolLevelUseCase } from "./ListSchoolLevelUseCase";

class ListSchoolLevelController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listSchoolLevelUseCase = container.resolve(
            ListSchoolLevelUseCase
        );
        const { name } = request.query;
        const { perPage, page }: IPaginationRequestDTO = request.query;

        const all = await listSchoolLevelUseCase.execute(
            {
                page,
                perPage,
            },
            String(name)
        );

        return response
            .setHeader("x-total-count", String(all.totalCount))
            .json(all.schoolLevels)
            .send();
    }
}

export { ListSchoolLevelController };
