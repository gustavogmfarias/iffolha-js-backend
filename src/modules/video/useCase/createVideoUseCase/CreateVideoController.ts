import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateVideoUseCase } from "./CreateVideoUseCase";

class CreateVideoController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: userAdminId } = request.user;

        const { description, url } = request.body;

        const createVideoUseCase = container.resolve(CreateVideoUseCase);

        const video = await createVideoUseCase.execute(
            description,
            url,
            userAdminId
        );

        return response.status(201).send(video);
    }
}

export { CreateVideoController };
