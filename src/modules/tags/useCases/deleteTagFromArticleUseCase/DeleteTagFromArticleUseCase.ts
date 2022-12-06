import { IUserResponseDTO } from "@modules/accounts/dtos/IUserResponseDTO";
import { UserMap } from "@modules/accounts/mapper/UserMap";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ITagsRepository } from "@modules/tags/repositories/ITagsRepository";
import { Article, Log, Tag, User } from "@prisma/client";
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
class DeleteTagFromArticleUseCase {
    constructor(
        @inject("TagsRepository") private tagsRepository: ITagsRepository,
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

        let tagsDeleted;
        let articleEdited;

        try {
            tagsDeleted =
                this.tagsRepository.deleteAllTagsFromArticle(articleId);
            articleEdited = await this.articleRepository.findById(articleId);
        } catch (err) {
            throw new AppError("Tags weren't deleted", 401);
        }

        const log = await this.logProvider.create({
            logRepository: "ARTICLE",
            description: `Tags successfully deleted!`,
            previousContent: JSON.stringify(article),
            contentEdited: JSON.stringify(articleEdited),
            editedByUserId: userAdminId,
            modelEditedId: article.id,
        });

        return { articleEdited, log };
    }
}

export { DeleteTagFromArticleUseCase };
