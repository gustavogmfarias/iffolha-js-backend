/* eslint-disable no-param-reassign */
import { inject, injectable } from "tsyringe";

import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Class } from "@prisma/client";
import { IClassesRepository } from "@modules/classes/repositories/IClassesRepository";

interface IResponse {
    classes: Class[];
    totalCount: number;
}

@injectable()
class ListClassesUseCase {
    constructor(
        @inject("ClassesRepository")
        private classRepository: IClassesRepository
    ) {}

    async execute(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<IResponse> {
        const totalCount = await this.classRepository.totalClasses();
        let classes: Class[];

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
            classes = await this.classRepository.listClasses({
                page,
                perPage,
            });
        }

        if (page && perPage && name) {
            classes = await this.classRepository.listClasses(
                {
                    page,
                    perPage,
                },
                name
            );
        }

        if (!page && !perPage && name) {
            classes = await this.classRepository.listClasses({}, name);
        }

        if (!page && !perPage && !name) {
            classes = await this.classRepository.listClasses({}, name);
        }

        return { classes, totalCount };
    }
}
export { ListClassesUseCase };
