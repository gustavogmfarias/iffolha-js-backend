import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListSocialMediaUseCase } from "./ListSocialMediaUseCase";

class ListSocialMediaController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listSocialMediaUseCase = container.resolve(
            ListSocialMediaUseCase
        );
        const { name } = request.query;
        const { perPage, page }: IPaginationRequestDTO = request.query;

        const all = await listSocialMediaUseCase.execute(
            {
                page,
                perPage,
            },
            String(name)
        );

        return response
            .setHeader("x-total-count", String(all.totalCount))
            .json(all.socialMedias)
            .send();
    }
}

export { ListSocialMediaController };
