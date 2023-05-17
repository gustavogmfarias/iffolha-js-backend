import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteVideoUseCase } from "./DeleteVideoUseCase";

class DeleteVideoController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: videoToDeleteId } = request.params;
        const { id: userAdminId } = request.user;
        const deleteVideoUseCase = container.resolve(DeleteVideoUseCase);

        const videoDeleted = await deleteVideoUseCase.execute(
            userAdminId,
            videoToDeleteId
        );

        return response.status(200).json(videoDeleted).send();
    }
}

export { DeleteVideoController };
