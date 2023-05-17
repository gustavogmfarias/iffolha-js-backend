import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteNewsletterUseCase } from "./DeleteNewsletterUseCase";

class DeleteNewsletterController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: newsletterToDeleteId } = request.params;
        const { id: userAdminId } = request.user;
        const deleteNewsletterUseCase = container.resolve(
            DeleteNewsletterUseCase
        );

        const newsletterDeleted = await deleteNewsletterUseCase.execute(
            userAdminId,
            newsletterToDeleteId
        );

        return response.status(200).json(newsletterDeleted).send();
    }
}

export { DeleteNewsletterController };
