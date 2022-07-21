import { Log } from "@prisma/client";
import { prisma } from "@shared/database/prismaClient";
import { ILogCreateDTO } from "../dtos/ILogCreateDTO";
import { ILogProvider } from "../ILogProvider";

export class LogProvider implements ILogProvider {
    async create({
        logRepository,
        description,
        previousContent,
        contentEdited,
        editedByUserId,
        modelEditedId,
    }: ILogCreateDTO): Promise<Log> {
        const logCreated = await prisma.log.create({
            data: {
                logRepository,
                description,
                previousContent,
                contentEdited,
                editedByUserId,
                modelEditedId,
            },
        });

        return logCreated;
    }
}
