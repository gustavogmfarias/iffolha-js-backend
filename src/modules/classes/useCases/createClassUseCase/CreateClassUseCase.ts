import { IClassesRepository } from "@modules/classes/repositories/IClassesRepository";
import { Class, Log } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    newClass: Class;
    log: Log;
}

@injectable()
class CreateClassUseCase {
    constructor(
        @inject("ClassesRepository")
        private classesRepository: IClassesRepository,
        @inject("LogProvider") private logProvider: ILogProvider
    ) {}

    async execute(
        name: string,
        userAdminId: string,
        courseId: string
    ): Promise<IResponse> {
        let newClass = await this.classesRepository.findClassByName(name);

        if (newClass) {
            throw new AppError("Class already exists", 400);
        }

        try {
            newClass = await this.classesRepository.createClass(name, courseId);
        } catch (err) {
            throw new AppError(err.message, 400);
        }

        const log = await this.logProvider.create({
            logRepository: "COURSE",
            description: `Class created successfully!`,
            previousContent: JSON.stringify(newClass),
            contentEdited: JSON.stringify(newClass),
            editedByUserId: userAdminId,
            modelEditedId: newClass.id,
        });

        return { newClass, log };
    }
}

export { CreateClassUseCase };
