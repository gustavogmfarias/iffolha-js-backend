import { Request, Response } from "express";
import { container } from "tsyringe";
import { ChangeOwnPasswordUseCase } from "./ChangeOwnPasswordUseCase";

class ChangeOwnPasswordController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.user;

        const { newPassword, previousPassword, confirmNewPassword } =
            request.body;

        const changeOwnPasswordUseCase = container.resolve(
            ChangeOwnPasswordUseCase
        );

        await changeOwnPasswordUseCase.execute({
            newPassword,
            previousPassword,
            confirmNewPassword,
            id,
        });

        return response.status(200).json();
    }
}

export { ChangeOwnPasswordController };
