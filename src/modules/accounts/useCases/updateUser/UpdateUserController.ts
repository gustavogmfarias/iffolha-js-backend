import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

class UpdateUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: userToEditId } = request.params;
        const userAdminId = request.user.id;

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

        const userEdited = await updateUserUseCase.execute({
            name,
            lastName,
            previousPassword,
            newPassword,
            confirmNewPassword,
            email,
            userToEditId,
            role,
            userAdminId,
        });

        return response.status(200).json(userEdited);
    }
}

export { UpdateUserController };
