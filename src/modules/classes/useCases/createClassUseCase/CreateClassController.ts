import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateCourseUseCase } from "./CreateCourseUseCase";

class CreateCourseController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: userAdminId } = request.user;

        const { name, schoolLevel } = request.body;

        const createCourseUseCase = container.resolve(CreateCourseUseCase);

        const course = await createCourseUseCase.execute(
            name,
            userAdminId,
            schoolLevel
        );

        return response.status(201).send(course);
    }
}

export { CreateCourseController };
