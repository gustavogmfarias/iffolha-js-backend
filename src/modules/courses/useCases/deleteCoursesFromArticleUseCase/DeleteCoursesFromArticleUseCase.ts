import { Article, Log } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { IArticleRepository } from "@modules/articles/repositories/IArticleRepository";
import { ITextualGenreRepository } from "@modules/textualGenre/repositories/ITextualGenreRepository";

interface IResponse {
    articleEdited: Article;
    log: Log;
}

@injectable()
class DeleteTextualGenresFromArticleUseCase {
    constructor(
        @inject("TextualGenreRepository")
        private textualGenreRepository: ITextualGenreRepository,
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

        let textualGenresDeleted;
        let articleEdited;

        try {
            textualGenresDeleted =
                await this.textualGenreRepository.deleteAllTextualGenresFromArticle(
                    articleId
                );
            articleEdited = await this.articleRepository.findById(articleId);
        } catch (err) {
            throw new AppError("TextualGenres weren't deleted", 401);
        }

        const log = await this.logProvider.create({
            logRepository: "TEXTUALGENRE",
            description: `TextualGenres successfully deleted!`,
            previousContent: JSON.stringify(article),
            contentEdited: JSON.stringify(articleEdited),
            editedByUserId: userAdminId,
            modelEditedId: article.id,
        });

        return { articleEdited, log };
    }
}

export { DeleteTextualGenresFromArticleUseCase };
