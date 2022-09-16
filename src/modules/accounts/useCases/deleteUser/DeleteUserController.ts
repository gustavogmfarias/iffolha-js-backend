import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteUserUseCase } from "./DeleteUserUseCase";

class DeleteUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: userToEdit } = request.params;
        const { id: userAdminId } = request.user;
        const deleteUserUseCase = container.resolve(DeleteUserUseCase);

        const userDeleted = await deleteUserUseCase.execute(
            userAdminId,
            userToEdit
        );

        return response.status(200).json(userDeleted).send();
    }
}

export { DeleteUserController };
