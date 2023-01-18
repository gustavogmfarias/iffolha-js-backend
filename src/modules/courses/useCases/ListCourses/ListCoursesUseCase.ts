/* eslint-disable no-param-reassign */
import { inject, injectable } from "tsyringe";

import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Course } from "@prisma/client";
import { ICoursesRepository } from "@modules/courses/repositories/ICoursesRepository";

interface IResponse {
    courses: Course[];
    totalCount: number;
}

@injectable()
class ListCoursesUseCase {
    constructor(
        @inject("CoursesRepository")
        private courseRepository: ICoursesRepository
    ) {}

    async execute(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<IResponse> {
        const totalCount = await this.courseRepository.totalCourses();
        let courses: Course[];

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
            courses = await this.courseRepository.listCourses({
                page,
                perPage,
            });
        }

        if (page && perPage && name) {
            courses = await this.courseRepository.listCourses(
                {
                    page,
                    perPage,
                },
                name
            );
        }

        if (!page && !perPage && name) {
            courses = await this.courseRepository.listCourses({}, name);
        }

        if (!page && !perPage && !name) {
            courses = await this.courseRepository.listCourses({}, name);
        }

        return { courses, totalCount };
    }
}
export { ListCoursesUseCase };
