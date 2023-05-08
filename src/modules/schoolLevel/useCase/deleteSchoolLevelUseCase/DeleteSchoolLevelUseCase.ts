import { ISchoolLevelRepository } from "@modules/schoolLevel/repositories/ISchoolLevelRepository";
import { Log, SchoolLevel } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    schoolLevel: SchoolLevel;
    log: Log;
}

@injectable()
class DeleteSchoolLevelUseCase {
    constructor(
        @inject("SchoolLevelRepository")
        private schoolLevelRepository: ISchoolLevelRepository,
        @inject("LogProvider")
        private logProvider: ILogProvider
    ) {}

    async execute(
        userAdminId: string,
        schoolLevelToDeleteId: string
    ): Promise<IResponse> {
        const schoolLevel = await this.schoolLevelRepository.findById(
            schoolLevelToDeleteId
        );

        if (!schoolLevel) {
            throw new AppError("SchoolLevel doesn't exists", 404);
        }
        let schoolLevelDeleted;

        try {
            schoolLevelDeleted = this.schoolLevelRepository.delete(
                schoolLevelToDeleteId
            );
        } catch (err) {
            throw new AppError("SchoolLevel wasn't deleted", 401);
        }

        const log = await this.logProvider.create({
            logRepository: "SCHOOLLEVEL",
            description: `SchoolLevel successfully deleted!`,
            previousContent: JSON.stringify(schoolLevel),
            contentEdited: JSON.stringify(schoolLevel),
            editedByUserId: userAdminId,
            modelEditedId: schoolLevel.id,
        });

        return { schoolLevel, log };
    }
}

export { DeleteSchoolLevelUseCase };
