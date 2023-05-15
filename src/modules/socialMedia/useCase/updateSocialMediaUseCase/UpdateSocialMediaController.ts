import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateSocialMediaUseCase } from "./UpdateSocialMediaUseCase";

class UpdateSocialMediaController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: userAdminId } = request.user;
        const { id: socialMediaId } = request.params;

        const { name } = request.body;

        const updateSocialMediaUseCase = container.resolve(
            UpdateSocialMediaUseCase
        );

        const socialMedia = await updateSocialMediaUseCase.execute(
            socialMediaId,
            name,
            userAdminId
        );

        return response.status(201).send(socialMedia);
    }
}

export { UpdateSocialMediaController };
