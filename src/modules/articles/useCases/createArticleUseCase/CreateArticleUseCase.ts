/* eslint-disable no-param-reassign */
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IArticleRepository } from "@modules/articles/repositories/IArticleRepository";
import { IAuthorsRepository } from "@modules/articles/repositories/IAuthorsRepository";
import { ITagsRepository } from "@modules/articles/repositories/ITagsRepository";
import { Article, Log } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
    title: string;
    subTitle: string;
    content: string;
    publishedByUserId: string;
    isHighlight: boolean;
    authors?: string[];
    tags?: string[];
    images?: string[];
    userAdminId: string;
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
        private tagsRepository: ITagsRepository
    ) {}

    async execute({
        title,
        subTitle,
        content,
        publishedByUserId,
        isHighlight,
        authors,
        images,
        tags,
        userAdminId,
    }: IRequest): Promise<(Article | Log)[]> {
        let log;

        const article = await this.articleRepository.create({
            title,
            subTitle,
            content,
            publishedByUserId,
            isHighlight,
            url: this.articleRepository.generateUrl(title),
        });

        if (article) {
            if (authors) {
                this.authorsRepository.addAuthorsToArticle(article.id, authors);
            }

            if (tags) {
                tags = tags.filter((este, i) => tags.indexOf(este) === i);
                tags.map(async (tag) => {
                    const tagFound = await this.tagsRepository.findTagByName(
                        tag
                    );

                    if (tagFound) {
                        await this.tagsRepository.addTagsToArticle(
                            article.id,
                            tagFound.id
                        );
                    } else {
                        const newTag = await this.tagsRepository.createTag(tag);
                        await this.tagsRepository.addTagsToArticle(
                            article.id,
                            newTag.id
                        );
                    }
                });
            }
            // this.articleRepository.updateCourses(article.id, courses);
            // this.articleRepository.updateClasses(article.id, classes);
            // this.articleRepository.updateImages(article.id, images);

            log = await this.logProvider.create({
                logRepository: "ARTICLE",
                description: `Article created successfully!`,
                previousContent: JSON.stringify(article),
                contentEdited: JSON.stringify(article),
                editedByUserId: userAdminId,
                modelEditedId: article.id,
            });
        }

        return [article, log];
    }
}

export { CreateArticleUseCase };
