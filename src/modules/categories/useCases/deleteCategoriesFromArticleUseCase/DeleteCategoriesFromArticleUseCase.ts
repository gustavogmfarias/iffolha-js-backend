import { IUserResponseDTO } from "@modules/accounts/dtos/IUserResponseDTO";
import { UserMap } from "@modules/accounts/mapper/UserMap";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICategoriesRepository } from "@modules/categories/repositories/ICategoriesRepository";
import { Article, Log, Category, User } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { ArticleRepository } from "@modules/articles/repositories/infra/ArticleRepository";
import { IArticleRepository } from "@modules/articles/repositories/IArticleRepository";

interface IResponse {
    articleEdited: Article;
    log: Log;
}

@injectable()
class DeleteCategoriesFromArticleUseCase {
    constructor(
        @inject("CategoriesRepository")
        private categoriesRepository: ICategoriesRepository,
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

        let categoriesDeleted;
        let articleEdited;

        try {
            categoriesDeleted =
                this.categoriesRepository.deleteAllCategoriesFromArticle(
                    articleId
                );
            articleEdited = await this.articleRepository.findById(articleId);
        } catch (err) {
            throw new AppError("Categories weren't deleted", 401);
        }

        const log = await this.logProvider.create({
            logRepository: "ARTICLE",
            description: `Categories successfully deleted!`,
            previousContent: JSON.stringify(article),
            contentEdited: JSON.stringify(articleEdited),
            editedByUserId: userAdminId,
            modelEditedId: article.id,
        });

        return { articleEdited, log };
    }
}

export { DeleteCategoriesFromArticleUseCase };
