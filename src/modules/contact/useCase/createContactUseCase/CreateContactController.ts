import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateContactUseCase } from "./CreateContactUseCase";

class CreateContactController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: userAdminId } = request.user;

        const { name, email, description, content } = request.body;

        const createContactUseCase = container.resolve(CreateContactUseCase);

        const contact = await createContactUseCase.execute(
            name,
            email,
            description,
            content,
            userAdminId
        );

        return response.status(201).send(contact);
    }
}

export { CreateContactController };
