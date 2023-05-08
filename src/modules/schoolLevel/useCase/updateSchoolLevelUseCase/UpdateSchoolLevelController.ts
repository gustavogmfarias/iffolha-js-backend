import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateSchoolLevelUseCase } from "./UpdateSchoolLevelUseCase";

class UpdateSchoolLevelController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: userAdminId } = request.user;
        const { id: schoolLevelId } = request.params;

        const { name } = request.body;

        const updateSchoolLevelUseCase = container.resolve(
            UpdateSchoolLevelUseCase
        );

        const schoolLevel = await updateSchoolLevelUseCase.execute(
            schoolLevelId,
            name,
            userAdminId
        );

        return response.status(201).send(schoolLevel);
    }
}

export { UpdateSchoolLevelController };
