import { LogRepository } from "@prisma/client";

export interface ILogCreateDTO {
    logRepository: LogRepository;
    description: string;
    previousContent: string;
    contentEdited: string;
    editedByUserId: string;
    modelEditedId: string;
}
