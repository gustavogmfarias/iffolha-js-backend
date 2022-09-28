import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import { Log } from "@prisma/client";
import { prisma } from "@shared/database/prismaClient";
import { ILogCreateDTO } from "../dtos/ILogCreateDTO";
import { ILogProvider, ListLogsProps } from "../ILogProvider";

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

    async listLogs(
        {
            startDate,
            endDate,
            logRepository,
            description,
            editedByUserId,
            modelEditedId,
        }: ListLogsProps,
        { page, perPage }: IPaginationRequestDTO
    ): Promise<Log[]> {
        let logs: Log[];

        if (!page || !perPage) {
            logs = await prisma.log.findMany({
                where: {
                    logRepository,
                    description,
                    editedByUserId,
                    modelEditedId,
                    createdAt: { gte: startDate, lte: endDate },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        } else {
            logs = await prisma.log.findMany({
                where: {
                    logRepository,
                    description,
                    editedByUserId,
                    modelEditedId,
                    createdAt: { gte: startDate, lte: endDate },
                },
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    createdAt: "desc",
                },
            });
        }

        return logs;
    }
}
