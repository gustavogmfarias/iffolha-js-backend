/* eslint-disable no-param-reassign */
import { inject, injectable } from "tsyringe";
import { ICoursesRepository } from "@modules/courses/repositories/ICoursesRepository";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Article, Course } from "@prisma/client";

interface IResponse {
    courses: Course[];
    totalCount: number;
}

@injectable()
class ListCoursesByLevelUseCase {
    constructor(
        @inject("CoursesRepository")
        private coursesRepository: ICoursesRepository
    ) {}

    async execute(
        { page, perPage }: IPaginationRequestDTO,
        level: string
    ): Promise<IResponse> {
        if (level === undefined || level === "undefined") {
            level = null;
        }

        if (page === undefined) {
            page = null;
        }

        if (perPage === undefined) {
            perPage = null;
        }

        const totalCountArr = await this.coursesRepository.listCoursesByLevel(
            {},
            level
        );
        const courses = await this.coursesRepository.listCoursesByLevel(
            {
                page,
                perPage,
            },
            level
        );

        return { courses, totalCount: totalCountArr.length };
    }
}
export { ListCoursesByLevelUseCase };
