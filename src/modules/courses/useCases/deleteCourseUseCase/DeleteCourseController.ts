import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteCourseUseCase } from "./DeleteCourseUseCase";

class DeleteCourseController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: courseToDeleteId } = request.params;
        const { id: userAdminId } = request.user;
        const deleteCourseUseCase = container.resolve(DeleteCourseUseCase);

        const courseDeleted = await deleteCourseUseCase.execute(
            userAdminId,
            courseToDeleteId
        );

        return response.status(200).json(courseDeleted).send();
    }
}

export { DeleteCourseController };
