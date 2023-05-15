import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateMenuAlertUseCase } from "./CreateMenuAlertUseCase";

class CreateMenuAlertController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: userAdminId } = request.user;

        const { content, color, menuAlertIsActive } = request.body;

        const createMenuAlertUseCase = container.resolve(
            CreateMenuAlertUseCase
        );

        const menuAlert = await createMenuAlertUseCase.execute(
            content,
            color,
            menuAlertIsActive,
            userAdminId
        );

        return response.status(201).send(menuAlert);
    }
}

export { CreateMenuAlertController };
