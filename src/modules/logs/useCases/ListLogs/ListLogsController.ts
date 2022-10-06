import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import { ListLogsProps } from "@shared/container/providers/LogProvider/ILogProvider";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListLogsUseCase } from "./ListLogsUseCase";

class ListLogsController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listLogsUseCase = container.resolve(ListLogsUseCase);
        const {
            startDate,
            endDate,
            logRepository,
            description,
            editedByUserId,
            modelEditedId,
        }: ListLogsProps = request.query;

        const { page, perPage }: IPaginationRequestDTO = request.query;

        const all = await listLogsUseCase.execute(
            {
                startDate,
                endDate,
                logRepository,
                description,
                editedByUserId,
                modelEditedId,
            },
            { page, perPage }
        );

        return response.status(200).send(all);
    }
}

export { ListLogsController };
