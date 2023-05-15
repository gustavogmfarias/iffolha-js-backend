/* eslint-disable no-param-reassign */
import { inject, injectable } from "tsyringe";

import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { MenuAlert } from "@prisma/client";
import { IMenuAlertRepository } from "@modules/menuAlert/repositories/IMenuAlertRepository";

interface IResponse {
    menuAlerts: MenuAlert[];
    totalCount: number;
}

@injectable()
class ListMenuAlertUseCase {
    constructor(
        @inject("MenuAlertRepository")
        private menuAlertRepository: IMenuAlertRepository
    ) {}

    async execute(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<IResponse> {
        const totalCount = await this.menuAlertRepository.list({});
        let menuAlerts: MenuAlert[];

        if (name === undefined || name === "undefined") {
            name = null;
        }

        if (page === undefined) {
            page = null;
        }

        if (perPage === undefined) {
            perPage = null;
        }

        if (page && perPage) {
            menuAlerts = await this.menuAlertRepository.list({
                page,
                perPage,
            });
        }

        if (page && perPage && name) {
            menuAlerts = await this.menuAlertRepository.list(
                {
                    page,
                    perPage,
                },
                name
            );
        }

        if (!page && !perPage && name) {
            menuAlerts = await this.menuAlertRepository.list({}, name);
        }

        if (!page && !perPage && !name) {
            menuAlerts = await this.menuAlertRepository.list({}, name);
        }

        return { menuAlerts, totalCount: totalCount.length };
    }
}
export { ListMenuAlertUseCase };
