import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateVideoUseCase } from "./UpdateVideoUseCase";

class UpdateVideoController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: userAdminId } = request.user;
        const { id: videoId } = request.params;

        const { description, url } = request.body;

        const updateVideoUseCase = container.resolve(UpdateVideoUseCase);

        const video = await updateVideoUseCase.execute(
            videoId,
            url,
            description,
            userAdminId
        );

        return response.status(201).send(video);
    }
}

export { UpdateVideoController };
