/* eslint-disable no-param-reassign */
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import {
    ArticleWithRelations,
    IArticleRepository,
} from "@modules/articles/repositories/IArticleRepository";
import { IAuthorsRepository } from "@modules/articles/repositories/IAuthorsRepository";
import { ITagsRepository } from "@modules/tags/repositories/ITagsRepository";
import { ICoursesRepository } from "@modules/courses/repositories/ICoursesRepository";
import { Article, Log } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { IClassesRepository } from "@modules/classes/repositories/IClassesRepository";
import { IUpdateArticleRequest } from "./UpdateArticleController";

interface IResponse {
    article: ArticleWithRelations;
    log: Log;
}

@injectable()
class UpdateArticleUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("LogProvider")
        private logProvider: ILogProvider,
        @inject("ArticleRepository")
        private articleRepository: IArticleRepository
    ) {}

    async execute(data: IUpdateArticleRequest): Promise<IResponse> {
        let articleUpdated: ArticleWithRelations;
        let log: Log;

        const article = await this.articleRepository.findById(data.id);

        if (!article) {
            throw new AppError("Article doesn't exist", 404);
        }

        try {
            articleUpdated = await this.articleRepository.update(data);

            log = await this.logProvider.create({
                logRepository: "ARTICLE",
                description: `Article updated successfully!`,
                previousContent: JSON.stringify(article),
                contentEdited: JSON.stringify(article),
                editedByUserId: data.editedByUserId,
                modelEditedId: article.id,
            });
        } catch (error) {
            console.log(error);

            throw new AppError("Error while updating an article", 500);
        }

        return { article: articleUpdated, log };
    }
}

export { UpdateArticleUseCase };
