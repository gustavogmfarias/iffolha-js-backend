import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateContactUseCase } from "./UpdateContactUseCase";

class UpdateContactController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: userAdminId } = request.user;
        const { id: contactId } = request.params;

        const isAnswered = true;

        const updateContactUseCase = container.resolve(UpdateContactUseCase);

        const contact = await updateContactUseCase.execute(
            contactId,
            isAnswered,
            userAdminId
        );

        return response.status(201).send(contact);
    }
}

export { UpdateContactController };
