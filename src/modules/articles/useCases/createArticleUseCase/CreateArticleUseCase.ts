/* eslint-disable no-param-reassign */
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import {
    ArticleWithRelations,
    IArticleRepository,
} from "@modules/articles/repositories/IArticleRepository";
import { IAuthorsRepository } from "@modules/articles/repositories/IAuthorsRepository";
import { ITagsRepository } from "@modules/tags/repositories/ITagsRepository";
import { ICoursesRepository } from "@modules/articles/repositories/ICoursesRepository";
import { Article, Log } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { IClassesRepository } from "@modules/articles/repositories/IClassesRepository";
import { ICategoriesRepository } from "@modules/articles/repositories/ICategoriesRepository";
import { ITextualGenreRepository } from "@modules/articles/repositories/ITextualGenreRepository";

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
        authors = null,
        courses = null,
        categories = null,
        textualGenres = null,
        images = null,
        tags = null,
        userAdminId,
        classes = null,
    }: IRequest): Promise<IResponse> {
        let log: Log;
        let articleWithRelations: ArticleWithRelations;

        const article = await this.articleRepository.create({
            title,
            subTitle,
            content,
            publishedByUserId,
            isHighlight,
            url: this.articleRepository.generateUrl(title),
        });

        if (article) {
            try {
                if (authors) {
                    await this.authorsRepository.addAuthorsToArticle(
                        article.id,
                        authors
                    );
                }

                if (tags) {
                    tags = tags.filter((este, i) => tags.indexOf(este) === i);
                    tags.map(async (tag) => {
                        const tagFound =
                            await this.tagsRepository.findTagByName(tag);

                        if (tagFound) {
                            await this.tagsRepository.addTagsToArticle(
                                article.id,
                                tagFound.id
                            );
                        } else {
                            const newTag = await this.tagsRepository.createTag(
                                tag
                            );
                            await this.tagsRepository.addTagsToArticle(
                                article.id,
                                newTag.id
                            );
                        }
                    });
                }

                if (categories) {
                    await this.categoriesRepository.addCategoriesToArticle(
                        article.id,
                        categories
                    );
                }

                if (textualGenres) {
                    await this.textualGenreRepository.addTextualGenresToArticle(
                        article.id,
                        textualGenres
                    );
                }

                if (courses) {
                    await this.coursesRepository.addCoursesToArticle(
                        article.id,
                        courses
                    );
                }

                if (classes) {
                    await this.classesRepository.addClassesToArticle(
                        article.id,
                        classes
                    );
                }

                // this.articleRepository.updateImages(article.id, images);
            } catch (err) {
                throw new AppError(err.message);
            } finally {
                articleWithRelations = await this.articleRepository.findById(
                    article.id
                );

                log = await this.logProvider.create({
                    logRepository: "ARTICLE",
                    description: `Article created successfully!`,
                    previousContent: JSON.stringify(articleWithRelations),
                    contentEdited: JSON.stringify(articleWithRelations),
                    editedByUserId: userAdminId,
                    modelEditedId: article.id,
                });
            }
        }

        return { articleWithRelations, log };
    }
}

export { CreateArticleUseCase };
