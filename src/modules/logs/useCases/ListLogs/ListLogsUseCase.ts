/* eslint-disable no-param-reassign */
import { inject, injectable } from "tsyringe";
import { Log } from "@prisma/client";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import {
    ILogProvider,
    ListLogsProps,
} from "@shared/container/providers/LogProvider/ILogProvider";
import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";

@injectable()
class ListLogsUseCase {
    constructor(
        @inject("LogProvider")
        private logProvider: ILogProvider,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) {}

    async execute(
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
        if (endDate) {
            endDate = this.dateProvider.addDaysToDate(endDate, 1);
        }

        const logs = await this.logProvider.listLogs(
            {
                startDate,
                endDate,
                logRepository,
                description,
                editedByUserId,
                modelEditedId,
            },
            {
                page,
                perPage,
            }
        );

        return logs;
    }
}
export { ListLogsUseCase };
