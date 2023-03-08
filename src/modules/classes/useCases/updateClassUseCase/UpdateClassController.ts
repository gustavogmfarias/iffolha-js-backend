import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateClassUseCase } from "./UpdateClassUseCase";

class UpdateClassController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: userAdminId } = request.user;
        const { id: classId } = request.params;

        const { name, courseId } = request.body;

        const updateClassUseCase = container.resolve(UpdateClassUseCase);

        const classUpdated = await updateClassUseCase.execute(
            classId,
            name,
            userAdminId,
            courseId
        );

        return response.status(201).send(classUpdated);
    }
}

export { UpdateClassController };
