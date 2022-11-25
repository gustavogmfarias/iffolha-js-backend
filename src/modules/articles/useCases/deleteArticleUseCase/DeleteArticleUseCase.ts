import { IArticleRepository } from "@modules/articles/repositories/IArticleRepository";
import { Article, Log } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    article: Article;
    log: Log;
}

@injectable()
class DeleteArticleUseCase {
    constructor(
        @inject("ArticleRepository")
        private articleRepository: IArticleRepository,
        @inject("LogProvider")
        private logProvider: ILogProvider
    ) {}

    async execute(
        userAdminId: string,
        articleToDelete: string
    ): Promise<IResponse> {
        const article = await this.articleRepository.findById(articleToDelete);

        if (!article) {
            throw new AppError("Article doesn't exists", 404);
        }
        let articleDeleted;

        try {
            articleDeleted = this.articleRepository.delete(articleToDelete);
        } catch (err) {
            throw new AppError("Article wasn't deleted", 401);
        }

        const log = await this.logProvider.create({
            logRepository: "ARTICLE",
            description: `Article successfully deleted!`,
            previousContent: JSON.stringify(article),
            contentEdited: JSON.stringify(article),
            editedByUserId: userAdminId,
            modelEditedId: articleToDelete,
        });

        return { article, log };
    }
}

export { DeleteArticleUseCase };
