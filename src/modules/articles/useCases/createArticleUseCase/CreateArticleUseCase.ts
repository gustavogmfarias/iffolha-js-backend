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
import { IClassesRepository } from "@modules/articles/repositories/IClassesRepository";
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

        let article;

        try {
            article = await this.articleRepository.create({
                title,
                subTitle,
                content,
                publishedByUserId,
                isHighlight,
                url: this.articleRepository.generateUrl(title),
            });
        } catch (error) {
            throw new AppError(error.message, 401);
        }

        if (article) {
            try {
                if (authors) {
                    try {
                        await this.authorsRepository.addAuthorsToArticle(
                            article.id,
                            authors
                        );
                    } catch (error) {
                        throw new AppError(error.message, 401);
                    }
                }

                if (tags) {
                    tags = tags.filter((este, i) => tags.indexOf(este) === i);
                    tags.map(async (tag) => {
                        let tagFound;
                        try {
                            tagFound = await this.tagsRepository.findTagByName(
                                tag
                            );
                        } catch (error) {
                            throw new AppError(error.message, 401);
                        }

                        if (tagFound) {
                            try {
                                await this.tagsRepository.addTagsToArticle(
                                    article.id,
                                    tagFound.id
                                );
                            } catch (error) {
                                throw new AppError(error.message, 401);
                            }
                        } else {
                            let newTag;

                            try {
                                newTag = await this.tagsRepository.createTag(
                                    tag
                                );
                                await this.tagsRepository.addTagsToArticle(
                                    article.id,
                                    newTag.id
                                );
                            } catch (error) {
                                throw new AppError(error.message, 401);
                            }
                        }
                    });
                }

                if (categories) {
                    try {
                        await this.categoriesRepository.addCategoriesToArticle(
                            article.id,
                            categories
                        );
                    } catch (error) {
                        throw new AppError(error.message, 401);
                    }
                }

                if (textualGenres) {
                    try {
                        await this.textualGenreRepository.addTextualGenresToArticle(
                            article.id,
                            textualGenres
                        );
                    } catch (error) {
                        throw new AppError(error.message, 401);
                    }
                }

                if (courses) {
                    this.addCoursesToArticle(courses, article.id);
                }

                if (classes) {
                    try {
                        await this.classesRepository.addClassesToArticle(
                            article.id,
                            classes
                        );
                    } catch (error) {
                        throw new AppError(error.message, 401);
                    }
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

    async addCoursesToArticle(
        courses: string[],
        articleId: string
    ): Promise<void> {
        if (courses) {
            try {
                await this.coursesRepository.addCoursesToArticle(
                    articleId,
                    courses
                );
            } catch (error) {
                throw new AppError(error.message, 401);
            }
        }
    }
}

export { CreateArticleUseCase };
