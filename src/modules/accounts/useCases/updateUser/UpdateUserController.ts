import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

class UpdateUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { userToEditId } = request.params;
        const { id } = request.user;

        const {
            name,
            lastName,
            previousPassword,
            newPassword,
            confirmNewPassword,
            email,
            role,
        } = request.body;

        const updateUserUseCase = container.resolve(UpdateUserUseCase);

        const userEdited = await updateUserUseCase.execute(id, {
            name,
            lastName,
            previousPassword,
            newPassword,
            confirmNewPassword,
            email,
            id: userToEditId,
            role,
        });

        return response.status(200).json(userEdited);
    }
}

export { UpdateUserController };
