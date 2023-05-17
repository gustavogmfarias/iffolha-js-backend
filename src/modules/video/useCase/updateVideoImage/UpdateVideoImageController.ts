import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateVideoImageUseCase } from "./UpdateVideoImageUseCase";

class UpdateVideoAvatarController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.user;
        const imageFile = request.file.filename;
        const videoToEditId = request.params.id;

        const updateVideoImageUseCase = container.resolve(
            UpdateVideoImageUseCase
        );

        await updateVideoImageUseCase.execute({
            videoToEditId,
            imageFile,
        });

        return response.status(201).send();
    }
}

export { UpdateVideoAvatarController };
