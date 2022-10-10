import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IArticleRepository } from "@modules/articles/repositories/IArticleRepository";
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
        private articleRepository: IArticleRepository
    ) {}

    async execute({
        title,
        subTitle,
        content,
        publishedByUserId,
        isHighlight,
        authors,
        images,
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
            // this.articleRepository.updateAuthors(article.id, authors);
            // this.articleRepository.updateImages(article.id, images);
            // this.articleRepository.updateTags(article.id, tags);
            // this.articleRepository.updateCourses(article.id, courses);
            // this.articleRepository.updateClasses(article.id, classes);

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
