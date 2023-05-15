import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateMenuAlertUseCase } from "./UpdateMenuAlertUseCase";

class UpdateMenuAlertController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: userAdminId } = request.user;
        const { id: menuAlertId } = request.params;

        const { content, color, menuAlertIsActive } = request.body;

        const updateMenuAlertUseCase = container.resolve(
            UpdateMenuAlertUseCase
        );

        const menuAlert = await updateMenuAlertUseCase.execute(
            menuAlertId,
            content,
            color,
            menuAlertIsActive,
            userAdminId
        );

        return response.status(201).send(menuAlert);
    }
}

export { UpdateMenuAlertController };
