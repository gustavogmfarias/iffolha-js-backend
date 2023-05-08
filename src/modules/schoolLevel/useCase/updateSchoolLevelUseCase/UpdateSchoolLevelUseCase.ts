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
class UpdateSchoolLevelUseCase {
    constructor(
        @inject("SchoolLevelRepository")
        private schoolLevelRepository: ISchoolLevelRepository,
        @inject("LogProvider") private logProvider: ILogProvider
    ) {}

    async execute(
        id: string,
        name: string,
        userAdminId: string
    ): Promise<IResponse> {
        const schoolLevel = await this.schoolLevelRepository.findByName(name);
        const schoolLevelToUpdate = await this.schoolLevelRepository.findById(
            id
        );

        if (schoolLevel) {
            throw new AppError("SchoolLevel already exists", 400);
        }

        if (!schoolLevelToUpdate) {
            throw new AppError("SchoolLevel doesn't exist", 400);
        }

        let schoolLeveUpdated;

        try {
            schoolLeveUpdated = await this.schoolLevelRepository.update(
                id,
                name
            );
        } catch (err) {
            throw new AppError(err.message, 400);
        }

        const log = await this.logProvider.create({
            logRepository: "SCHOOLLEVEL",
            description: `SchoolLevel updated successfully!`,
            previousContent: JSON.stringify(schoolLevelToUpdate),
            contentEdited: JSON.stringify(schoolLeveUpdated),
            editedByUserId: userAdminId,
            modelEditedId: schoolLeveUpdated.id,
        });

        return { schoolLevel: schoolLeveUpdated, log };
    }
}

export { UpdateSchoolLevelUseCase };
