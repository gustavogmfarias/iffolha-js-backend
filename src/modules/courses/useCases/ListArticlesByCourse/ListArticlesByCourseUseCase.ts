/* eslint-disable no-param-reassign */
import { inject, injectable } from "tsyringe";
import { ICoursesRepository } from "@modules/courses/repositories/ICoursesRepository";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Article, Course } from "@prisma/client";

interface IResponse {
    articles: Article[];
    totalCount: number;
}

@injectable()
class ListArticlesByCourseUseCase {
    constructor(
        @inject("CoursesRepository")
        private coursesRepository: ICoursesRepository
    ) {}

    async execute(
        { page, perPage }: IPaginationRequestDTO,
        courseName?: string,
        articleTitle?: string
    ): Promise<IResponse> {
        if (courseName === undefined || courseName === "undefined") {
            courseName = null;
        }
        if (articleTitle === undefined || articleTitle === "undefined") {
            articleTitle = null;
        }

        if (page === undefined) {
            page = null;
        }

        if (perPage === undefined) {
            perPage = null;
        }

        const totalCountArr = await this.coursesRepository.listArticlesByCourse(
            {},
            courseName,
            articleTitle
        );
        const articles = await this.coursesRepository.listArticlesByCourse(
            {
                page,
                perPage,
            },
            courseName,
            articleTitle
        );

        return { articles, totalCount: totalCountArr.length };
    }
}
export { ListArticlesByCourseUseCase };
