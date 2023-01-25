import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateClassUseCase } from "./CreateClassUseCase";

class CreateClassController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: userAdminId } = request.user;

        const { name, courseId } = request.body;

        const createClassUseCase = container.resolve(CreateClassUseCase);

        const newClass = await createClassUseCase.execute(
            name,
            userAdminId,
            courseId
        );

        return response.status(201).send(newClass);
    }
}

export { CreateClassController };
