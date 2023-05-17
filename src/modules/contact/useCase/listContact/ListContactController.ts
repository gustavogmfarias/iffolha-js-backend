import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListContactUseCase } from "./ListContactUseCase";

class ListContactController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listContactUseCase = container.resolve(ListContactUseCase);
        const { description } = request.query;
        const { perPage, page }: IPaginationRequestDTO = request.query;

        const all = await listContactUseCase.execute(
            {
                page,
                perPage,
            },
            String(description)
        );

        return response
            .setHeader("x-total-count", String(all.totalCount))
            .json(all.contacts)
            .send();
    }
}

export { ListContactController };
