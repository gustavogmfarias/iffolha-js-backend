import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteTagUseCase } from "./DeleteTagUseCase";

class DeleteTagController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { name } = request.params;
        const { id: userAdminId } = request.user;
        const deleteTagUseCase = container.resolve(DeleteTagUseCase);

        const tagDeleted = await deleteTagUseCase.execute(userAdminId, name);

        return response.status(200).json(tagDeleted).send();
    }
}

export { DeleteTagController };
