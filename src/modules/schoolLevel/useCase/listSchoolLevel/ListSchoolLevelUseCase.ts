/* eslint-disable no-param-reassign */
import { inject, injectable } from "tsyringe";

import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { SchoolLevel } from "@prisma/client";
import { ISchoolLevelRepository } from "@modules/schoolLevel/repositories/ISchoolLevelRepository";

interface IResponse {
    schoolLevels: SchoolLevel[];
    totalCount: number;
}

@injectable()
class ListSchoolLevelUseCase {
    constructor(
        @inject("SchoolLevelRepository")
        private schoolLevelRepository: ISchoolLevelRepository
    ) {}

    async execute(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<IResponse> {
        const totalCount = await this.schoolLevelRepository.list({});
        let schoolLevels: SchoolLevel[];

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
            schoolLevels = await this.schoolLevelRepository.list({
                page,
                perPage,
            });
        }

        if (page && perPage && name) {
            schoolLevels = await this.schoolLevelRepository.list(
                {
                    page,
                    perPage,
                },
                name
            );
        }

        if (!page && !perPage && name) {
            schoolLevels = await this.schoolLevelRepository.list({}, name);
        }

        if (!page && !perPage && !name) {
            schoolLevels = await this.schoolLevelRepository.list({}, name);
        }

        return { schoolLevels, totalCount: totalCount.length };
    }
}
export { ListSchoolLevelUseCase };
