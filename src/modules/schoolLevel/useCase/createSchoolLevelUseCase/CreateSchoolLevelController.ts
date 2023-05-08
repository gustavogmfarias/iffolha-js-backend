import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateSchoolLevelUseCase } from "./CreateSchoolLevelUseCase";

class CreateSchoolLevelController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: userAdminId } = request.user;

        const { name } = request.body;

        const createSchoolLevelUseCase = container.resolve(
            CreateSchoolLevelUseCase
        );

        const schoolLevel = await createSchoolLevelUseCase.execute(
            name,
            userAdminId
        );

        return response.status(201).send(schoolLevel);
    }
}

export { CreateSchoolLevelController };
