import { IClassesRepository } from "@modules/classes/repositories/IClassesRepository";
import { Class, Log } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    classUpdated: Class;
    log: Log;
}

@injectable()
class UpdateClassUseCase {
    constructor(
        @inject("ClassesRepository")
        private classesRepository: IClassesRepository,
        @inject("LogProvider") private logProvider: ILogProvider
    ) {}

    async execute(
        classId: string,
        name: string,
        userAdminId: string,
        courseId: string
    ): Promise<IResponse> {
        let classUpdated: Class;

        const classToUpdate = this.classesRepository.findClassById(classId);

        const classNameAlreadyExistis =
            await this.classesRepository.findClassByName(name);

        if (classNameAlreadyExistis) {
            throw new AppError("Class already exists", 400);
        }

        try {
            classUpdated = await this.classesRepository.update(
                classId,
                name,
                courseId
            );
        } catch (err) {
            throw new AppError(err.message, 400);
        }

        const log = await this.logProvider.create({
            logRepository: "CLASS",
            description: `Class updated successfully!`,
            previousContent: JSON.stringify(classToUpdate),
            contentEdited: JSON.stringify(classUpdated),
            editedByUserId: userAdminId,
            modelEditedId: classUpdated.id,
        });

        return { classUpdated, log };
    }
}

export { UpdateClassUseCase };
