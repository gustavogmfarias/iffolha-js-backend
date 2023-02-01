/* eslint-disable no-param-reassign */
import { inject, injectable } from "tsyringe";
import { IClassesRepository } from "@modules/classes/repositories/IClassesRepository";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Article, Class } from "@prisma/client";

interface IResponse {
    classes: Class[];
    totalCount: number;
}

@injectable()
class ListClassesByCourseUseCase {
    constructor(
        @inject("ClassesRepository")
        private classesRepository: IClassesRepository
    ) {}

    async execute(
        { page, perPage }: IPaginationRequestDTO,
        courseId: string
    ): Promise<IResponse> {
        if (courseId === undefined || courseId === "undefined") {
            courseId = null;
        }

        if (page === undefined) {
            page = null;
        }

        if (perPage === undefined) {
            perPage = null;
        }

        const totalCountArr = await this.classesRepository.listClassesByCourse(
            {},
            courseId
        );
        const classes = await this.classesRepository.listClassesByCourse(
            {
                page,
                perPage,
            },
            courseId
        );

        return { classes, totalCount: totalCountArr.length };
    }
}
export { ListClassesByCourseUseCase };
