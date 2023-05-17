import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListNewsletterUseCase } from "./ListNewsletterUseCase";

class ListNewsletterController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listNewsletterUseCase = container.resolve(ListNewsletterUseCase);
        const { email } = request.query;
        const { perPage, page }: IPaginationRequestDTO = request.query;

        const all = await listNewsletterUseCase.execute(
            {
                page,
                perPage,
            },
            String(email)
        );

        return response
            .setHeader("x-total-count", String(all.totalCount))
            .json(all.newsletters)
            .send();
    }
}

export { ListNewsletterController };
