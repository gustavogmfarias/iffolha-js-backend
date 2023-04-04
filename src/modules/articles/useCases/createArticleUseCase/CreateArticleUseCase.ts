/* eslint-disable no-unsafe-finally */
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
import { ICategoriesRepository } from "@modules/categories/repositories/ICategoriesRepository";
import { ITextualGenreRepository } from "@modules/textualGenre/repositories/ITextualGenreRepository";

interface IRequest {
    title: string;
    subTitle: string;
    content: string;
    publishedByUserId: string;
    isHighlight: boolean;
    authors?: string[];
    tags?: string[];
    categories?: string[];
    textualGenres?: string[];
    images?: string[];
    courses?: string[];
    classes?: string[];
    userAdminId: string;
}

interface IResponse {
    articleWithRelations: ArticleWithRelations;
    log: Log;
}

@injectable()
class CreateArticleUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("LogProvider")
        private logProvider: ILogProvider,
        @inject("ArticleRepository")
        private articleRepository: IArticleRepository,
        @inject("AuthorsRepository")
        private authorsRepository: IAuthorsRepository,
        @inject("TagsRepository")
        private tagsRepository: ITagsRepository,
        @inject("CoursesRepository")
        private coursesRepository: ICoursesRepository,
        @inject("ClassesRepository")
        private classesRepository: IClassesRepository,
        @inject("CategoriesRepository")
        private categoriesRepository: ICategoriesRepository,
        @inject("TextualGenreRepository")
        private textualGenreRepository: ITextualGenreRepository
    ) {}

    async execute({
        title,
        subTitle,
        content,
        publishedByUserId,
        isHighlight,
        authors,
        courses,
        categories,
        textualGenres,
        images,
        tags,
        userAdminId,
        classes,
    }: IRequest): Promise<IResponse> {
        let log: Log;
        let articleWithRelations: ArticleWithRelations;
        let article;

        try {
            articleWithRelations = await this.articleRepository.create({
                title,
                subTitle,
                content,
                publishedByUserId,
                isHighlight,
                url: this.articleRepository.generateUrl(title),
                tags,
                courses,
                categories,
                textualGenres,
                authors,
                classes,
            });
        } catch (error) {
            throw new AppError(error.message, 401);
        }

        try {
            log = await this.logProvider.create({
                logRepository: "ARTICLE",
                description: `Article created successfully!`,
                previousContent: JSON.stringify(articleWithRelations),
                contentEdited: JSON.stringify(articleWithRelations),
                editedByUserId: userAdminId,
                modelEditedId: articleWithRelations.id,
            });
        } catch (err) {
            throw new AppError(err.message);
        }

        return { articleWithRelations, log };
    }
}
export { CreateArticleUseCase };
