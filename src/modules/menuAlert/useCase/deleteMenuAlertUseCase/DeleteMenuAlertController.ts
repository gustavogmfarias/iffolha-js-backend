import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteMenuAlertUseCase } from "./DeleteMenuAlertUseCase";

class DeleteMenuAlertController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: menuAlertToDeleteId } = request.params;
        const { id: userAdminId } = request.user;
        const deleteMenuAlertUseCase = container.resolve(
            DeleteMenuAlertUseCase
        );

        const menuAlertDeleted = await deleteMenuAlertUseCase.execute(
            userAdminId,
            menuAlertToDeleteId
        );

        return response.status(200).json(menuAlertDeleted).send();
    }
}

export { DeleteMenuAlertController };
