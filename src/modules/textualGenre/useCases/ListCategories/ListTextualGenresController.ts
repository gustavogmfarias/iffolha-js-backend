import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListTextualGenresUseCase } from "./ListTextualGenresUseCase";

class ListTextualGenresController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listTextualGenresUseCase = container.resolve(
            ListTextualGenresUseCase
        );
        const { name } = request.query;
        const { perPage, page }: IPaginationRequestDTO = request.query;

        const all = await listTextualGenresUseCase.execute(
            {
                page,
                perPage,
            },
            String(name)
        );

        return response
            .setHeader("x-total-count", String(all.totalCount))
            .json(all.textualGenres)
            .send();
    }
}

export { ListTextualGenresController };
