import { IClassesRepository } from "@modules/classes/repositories/IClassesRepository";
import { Log, Class } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    class: Class;
    log: Log;
}

@injectable()
class DeleteClassUseCase {
    constructor(
        @inject("ClassesRepository")
        private classesRepository: IClassesRepository,
        @inject("LogProvider")
        private logProvider: ILogProvider
    ) {}

    async execute(
        userAdminId: string,
        classToDeleteId: string
    ): Promise<IResponse> {
        const classToDelete = await this.classesRepository.findClassById(
            classToDeleteId
        );

        if (!classToDelete) {
            throw new AppError("Class doesn't exists", 404);
        }
        let classDeleted;

        try {
            classDeleted = this.classesRepository.deleteClass(classToDeleteId);
        } catch (err) {
            throw new AppError("Class wasn't deleted", 401);
        }

        const log = await this.logProvider.create({
            logRepository: "COURSE",
            description: `Class successfully deleted!`,
            previousContent: JSON.stringify(classToDelete),
            contentEdited: JSON.stringify(classToDelete),
            editedByUserId: userAdminId,
            modelEditedId: classToDelete.id,
        });

        return { class: classToDelete, log };
    }
}

export { DeleteClassUseCase };
