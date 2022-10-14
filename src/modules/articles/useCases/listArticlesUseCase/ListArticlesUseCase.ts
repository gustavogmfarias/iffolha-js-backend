import { inject, injectable } from "tsyringe";
import { IPaginationRequestDTO } from "@modules/accounts/dtos/IPaginationRequestDTO";
import { IArticleRepository } from "@modules/articles/repositories/IArticleRepository";
import { Article } from "@prisma/client";
import { IArticleResponseDTO } from "@modules/articles/dtos/IArticleResponseDTO";

@injectable()
class ListArticlesUseCase {
    constructor(
        @inject("ArticleRepository")
        private articleRepository: IArticleRepository
    ) {}

    async execute({
        page,
        perPage,
    }: IPaginationRequestDTO): Promise<Article[]> {
        const articles = await this.articleRepository.list({
            page,
            perPage,
        });

        const articlesDTO: IArticleResponseDTO[] = [];
        articles.map((article) => {
            return articlesDTO.push(this.articleRepository.convertDTO(article));
        });

        return articles;
    }
}
export { ListArticlesUseCase };
