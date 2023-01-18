import { Article, Log } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { IArticleRepository } from "@modules/articles/repositories/IArticleRepository";
import { ICoursesRepository } from "@modules/courses/repositories/ICoursesRepository";

interface IResponse {
    articleEdited: Article;
    log: Log;
}

@injectable()
class DeleteCoursesFromArticleUseCase {
    constructor(
        @inject("CoursesRepository")
        private coursesRepository: ICoursesRepository,
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

        let coursesDeleted;
        let articleEdited;

        try {
            coursesDeleted =
                await this.coursesRepository.deleteAllCoursesFromArticle(
                    articleId
                );
            articleEdited = await this.articleRepository.findById(articleId);
        } catch (err) {
            throw new AppError("Courses weren't deleted", 401);
        }

        const log = await this.logProvider.create({
            logRepository: "COURSE",
            description: `Courses successfully deleted!`,
            previousContent: JSON.stringify(article),
            contentEdited: JSON.stringify(articleEdited),
            editedByUserId: userAdminId,
            modelEditedId: article.id,
        });

        return { articleEdited, log };
    }
}

export { DeleteCoursesFromArticleUseCase };
