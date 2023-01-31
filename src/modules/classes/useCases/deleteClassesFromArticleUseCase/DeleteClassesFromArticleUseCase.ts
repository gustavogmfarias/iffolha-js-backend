import { Article, Log } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { IArticleRepository } from "@modules/articles/repositories/IArticleRepository";
import { IClassesRepository } from "@modules/classes/repositories/IClassesRepository";

interface IResponse {
    articleEdited: Article;
    log: Log;
}

@injectable()
class DeleteClassesFromArticleUseCase {
    constructor(
        @inject("ClassesRepository")
        private classesRepository: IClassesRepository,
        @inject("ArticleRepository")
        private articleRepository: IArticleRepository,
        @inject("LogProvider")
        private logProvider: ILogProvider
    ) {}

    async execute(userAdminId: string, articleId: string): Promise<IResponse> {
        const article = await this.articleRepository.findById(articleId);

        if (!article) {
            throw new AppError("Article doesn't exists", 404);
        }

        let classesDeleted;
        let articleEdited;

        try {
            classesDeleted =
                await this.classesRepository.deleteAllClassesFromArticle(
                    articleId
                );
            articleEdited = await this.articleRepository.findById(articleId);
        } catch (err) {
            throw new AppError("Classes weren't deleted", 401);
        }

        const log = await this.logProvider.create({
            logRepository: "CLASS",
            description: `Classes successfully deleted!`,
            previousContent: JSON.stringify(article),
            contentEdited: JSON.stringify(articleEdited),
            editedByUserId: userAdminId,
            modelEditedId: article.id,
        });

        return { articleEdited, log };
    }
}

export { DeleteClassesFromArticleUseCase };
