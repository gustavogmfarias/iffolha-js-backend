/* eslint-disable no-param-reassign */
import { inject, injectable } from "tsyringe";
import { IClassesRepository } from "@modules/classes/repositories/IClassesRepository";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { Article, Class } from "@prisma/client";

interface IResponse {
    articles: Article[];
    totalCount: number;
}

@injectable()
class ListArticlesByClassUseCase {
    constructor(
        @inject("ClassesRepository")
        private classesRepository: IClassesRepository
    ) {}

    async execute(
        { page, perPage }: IPaginationRequestDTO,
        classId?: string,
        articleTitle?: string
    ): Promise<IResponse> {
        if (classId === undefined || classId === "undefined") {
            classId = null;
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

        const totalCountArr = await this.classesRepository.listArticlesByClass(
            {},
            classId,
            articleTitle
        );
        const articles = await this.classesRepository.listArticlesByClass(
            {
                page,
                perPage,
            },
            classId,
            articleTitle
        );

        return { articles, totalCount: totalCountArr.length };
    }
}
export { ListArticlesByClassUseCase };
