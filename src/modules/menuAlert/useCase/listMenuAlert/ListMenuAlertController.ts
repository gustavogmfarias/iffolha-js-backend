import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListMenuAlertUseCase } from "./ListMenuAlertUseCase";

class ListMenuAlertController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listMenuAlertUseCase = container.resolve(ListMenuAlertUseCase);
        const { name } = request.query;
        const { perPage, page }: IPaginationRequestDTO = request.query;

        const all = await listMenuAlertUseCase.execute(
            {
                page,
                perPage,
            },
            String(name)
        );

        return response
            .setHeader("x-total-count", String(all.totalCount))
            .json(all.menuAlerts)
            .send();
    }
}

export { ListMenuAlertController };
