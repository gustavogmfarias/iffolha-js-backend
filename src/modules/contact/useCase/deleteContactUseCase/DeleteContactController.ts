import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteContactUseCase } from "./DeleteContactUseCase";

class DeleteContactController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: contactToDeleteId } = request.params;
        const { id: userAdminId } = request.user;
        const deleteContactUseCase = container.resolve(DeleteContactUseCase);

        const contactDeleted = await deleteContactUseCase.execute(
            userAdminId,
            contactToDeleteId
        );

        return response.status(200).json(contactDeleted).send();
    }
}

export { DeleteContactController };
