import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateCourseUseCase } from "./UpdateCourseUseCase";

class UpdateCourseController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: userAdminId } = request.user;
        const { id: courseId } = request.params;

        const { name, schoolLevel } = request.body;

        const updateCourseUseCase = container.resolve(UpdateCourseUseCase);

        const course = await updateCourseUseCase.execute(
            courseId,
            name,
            userAdminId,
            schoolLevel
        );

        return response.status(201).send(course);
    }
}

export { UpdateCourseController };
