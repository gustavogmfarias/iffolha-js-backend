import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateSocialMediaUseCase } from "./CreateSocialMediaUseCase";

class CreateSocialMediaController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: userAdminId } = request.user;

        const { name, url } = request.body;

        const createSocialMediaUseCase = container.resolve(
            CreateSocialMediaUseCase
        );

        const socialMedia = await createSocialMediaUseCase.execute(
            name,
            url,
            userAdminId
        );

        return response.status(201).send(socialMedia);
    }
}

export { CreateSocialMediaController };
