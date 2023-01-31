import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteClassUseCase } from "./DeleteClassUseCase";

class DeleteClassController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: classToDeleteId } = request.params;
        const { id: userAdminId } = request.user;
        const deleteClassUseCase = container.resolve(DeleteClassUseCase);

        const classDeleted = await deleteClassUseCase.execute(
            userAdminId,
            classToDeleteId
        );

        return response.status(200).json(classDeleted).send();
    }
}

export { DeleteClassController };
