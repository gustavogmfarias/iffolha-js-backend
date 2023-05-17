import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateNewsletterUseCase } from "./CreateNewsletterUseCase";

class CreateNewsletterController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: userAdminId } = request.user;

        const { name, email } = request.body;

        const createNewsletterUseCase = container.resolve(
            CreateNewsletterUseCase
        );

        const newsletter = await createNewsletterUseCase.execute(
            name,
            email,

            userAdminId
        );

        return response.status(201).send(newsletter);
    }
}

export { CreateNewsletterController };
