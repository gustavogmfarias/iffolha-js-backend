import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteSocialMediaUseCase } from "./DeleteSocialMediaUseCase";

class DeleteSocialMediaController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: socialMediaToDeleteId } = request.params;
        const { id: userAdminId } = request.user;
        const deleteSocialMediaUseCase = container.resolve(
            DeleteSocialMediaUseCase
        );

        const socialMediaDeleted = await deleteSocialMediaUseCase.execute(
            userAdminId,
            socialMediaToDeleteId
        );

        return response.status(200).json(socialMediaDeleted).send();
    }
}

export { DeleteSocialMediaController };
