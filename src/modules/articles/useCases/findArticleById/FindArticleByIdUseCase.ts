/* eslint-disable array-callback-return */
import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";

import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import {
    ArticleWithRelations,
    IArticleRepository,
} from "@modules/articles/repositories/IArticleRepository";
import { IArticleResponseDTO } from "@modules/articles/dtos/IArticleResponseDTO";

@injectable()
class FindArticleByIdUseCase {
    constructor(
        @inject("ArticleRepository")
        private articleRepository: IArticleRepository
    ) {}

    async execute({ id }): Promise<ArticleWithRelations | null> {
        const article = await this.articleRepository.findById(id);

        return article;
    }
}
export { FindArticleByIdUseCase };
