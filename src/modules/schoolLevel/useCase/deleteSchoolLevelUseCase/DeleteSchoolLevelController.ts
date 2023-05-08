import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteSchoolLevelUseCase } from "./DeleteSchoolLevelUseCase";

class DeleteSchoolLevelController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: schoolLevelToDeleteId } = request.params;
        const { id: userAdminId } = request.user;
        const deleteSchoolLevelUseCase = container.resolve(
            DeleteSchoolLevelUseCase
        );

        const schoolLevelDeleted = await deleteSchoolLevelUseCase.execute(
            userAdminId,
            schoolLevelToDeleteId
        );

        return response.status(200).json(schoolLevelDeleted).send();
    }
}

export { DeleteSchoolLevelController };
