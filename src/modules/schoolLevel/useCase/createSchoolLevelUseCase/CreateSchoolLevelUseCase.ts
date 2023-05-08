import { ISchoolLevelRepository } from "@modules/schoolLevel/repositories/ISchoolLevelRepository";
import { SchoolLevel, Log } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    schoolLevel: SchoolLevel;
    log: Log;
}

@injectable()
class CreateSchoolLevelUseCase {
    constructor(
        @inject("SchoolLevelRepository")
        private schoolLevelRepository: ISchoolLevelRepository,
        @inject("LogProvider") private logProvider: ILogProvider
    ) {}

    async execute(name: string, userAdminId: string): Promise<IResponse> {
        let schoolLevel = await this.schoolLevelRepository.findByName(name);

        if (schoolLevel) {
            throw new AppError("SchoolLevel already exists", 400);
        }

        try {
            schoolLevel = await this.schoolLevelRepository.create(name);
        } catch (err) {
            throw new AppError(err.message, 400);
        }

        const log = await this.logProvider.create({
            logRepository: "SCHOOLLEVEL",
            description: `SchoolLevel created successfully!`,
            previousContent: JSON.stringify(schoolLevel),
            contentEdited: JSON.stringify(schoolLevel),
            editedByUserId: userAdminId,
            modelEditedId: schoolLevel.id,
        });

        return { schoolLevel, log };
    }
}

export { CreateSchoolLevelUseCase };
