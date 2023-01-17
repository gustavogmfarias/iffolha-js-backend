/* eslint-disable no-param-reassign */
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IArticleRepository } from "@modules/articles/repositories/IArticleRepository";
import { IAuthorsRepository } from "@modules/articles/repositories/IAuthorsRepository";
import { ITagsRepository } from "@modules/tags/repositories/ITagsRepository";
import { ICoursesRepository } from "@modules/courses/repositories/ICoursesRepository";
import { Article, Log } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { IClassesRepository } from "@modules/articles/repositories/IClassesRepository";

interface IRequest {
    id: string;
    title: string;
    subTitle: string;
    content: string;
    editedByUserId: string;
    isHighlight: boolean;
    authors?: string[];
    tags?: string[];
    images?: string[];
    courses?: string[];
    classes?: string[];
}

@injectable()
class UpdateArticleUseCase {
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
        private classesRepository: IClassesRepository
    ) {}

    async execute({
        id,
        title,
        subTitle,
        content,
        editedByUserId,
        isHighlight,
        authors,
        courses,
        images,
        tags,
        classes,
    }: IRequest): Promise<(Article | Log)[]> {
        let log;
        const article = await this.articleRepository.findById(id);

        if (!article) {
            throw new AppError("Article doesn't exist", 404);
        }

        const previousTagsOnArticle: string[] = [];
        const previousAuthorsOnArticle: string[] = [];
        const previousCoursesOnArticle: string[] = [];
        const previousClassesOnArticle: string[] = [];
        const previousImages: string[] = [];

        // article.TagsOnArticles.map((data) => {
        //     const tagName = data.tag.name;

        //     previousTagsOnArticle.push(data.tag.name);
        // });

        // article.CoursesOnArticles.map((data) => {
        //     const courseName = data.course.name;
        //     previousCoursesOnArticle.push(courseName);
        // });

        // article.ClassOnArticles.map((data) => {
        //     const className = data.class.name;
        //     previousClassesOnArticle.push(className);
        // });

        // article.images.map((data) => {
        //     const imagesLinkName = this.articleRepository.imageUrl(data.image);

        //     previousImages.push(imagesLinkName);
        // });

        // article.AuthorsOnArticles.map((data) => {
        //     const authorId = data.author.id;

        //     previousAuthorsOnArticle.push(data.author.id);
        // });

        // article = await this.articleRepository.update(id, {
        //     title,
        //     subTitle,
        //     content,
        //     editedByUserId,
        //     isHighlight,
        //     url: this.articleRepository.generateUrl(title),
        // });

        if (article) {
            if (authors) {
                // verificar se os autores são os mesmos
                // se for diferente
                // 1 remove os que não são mais iguais
                // adiciona os novos

                const authorsDeleted: string[] = [];
                const authorsIncluded: string[] = [];
                const authorsContinued: string[] = [];

                // authors.map((author) => {
                //     previousAuthorsOnArticle.map((previousAuthor) => {
                //         if (author !== previousAuthor) {
                //             return authorsIncluded.push(author);
                //         }
                //         return authorsContinued.push(author);
                //     });
                // });

                await this.authorsRepository.delAuthorsToArticle(
                    article.id,
                    previousAuthorsOnArticle
                );

                await this.authorsRepository.addAuthorsToArticle(
                    article.id,
                    authors
                );
            }

            // if (tags) {
            //     tags = tags.filter((este, i) => tags.indexOf(este) === i);
            //     tags.map(async (tag) => {
            //         const tagFound = await this.tagsRepository.findTagByName(
            //             tag
            //         );

            //         if (tagFound) {
            //             await this.tagsRepository.addTagsToArticle(
            //                 article.id,
            //                 tagFound.id
            //             );
            //         } else {
            //             const newTag = await this.tagsRepository.createTag(tag);
            //             await this.tagsRepository.addTagsToArticle(
            //                 article.id,
            //                 newTag.id
            //             );
            //         }
            //     });
            // }

            // if (courses) {
            //     await this.coursesRepository.addCoursesToArticle(
            //         article.id,
            //         courses
            //     );
            // }

            // if (classes) {
            //     await this.classesRepository.addClassesToArticle(
            //         article.id,
            //         classes
            //     );
            // }

            // this.articleRepository.updateImages(article.id, images);

            log = await this.logProvider.create({
                logRepository: "ARTICLE",
                description: `Article updated successfully!`,
                previousContent: JSON.stringify(article),
                contentEdited: JSON.stringify(article),
                editedByUserId,
                modelEditedId: article.id,
            });
        }

        return [article, log];
    }
}

export { UpdateArticleUseCase };
