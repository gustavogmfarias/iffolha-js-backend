import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import { Log, LogRepository } from "@prisma/client";
import { ILogCreateDTO } from "./dtos/ILogCreateDTO";

export interface ListLogsProps {
    startDate?: Date;
    endDate?: Date;
    logRepository?: LogRepository;
    description?: string;
    editedByUserId?: string;
    modelEditedId?: string;
}

export interface ILogProvider {
    create(data: ILogCreateDTO): Promise<Log>;
    listLogs(data: ListLogsProps, pag: IPaginationRequestDTO): Promise<Log[]>;
}
