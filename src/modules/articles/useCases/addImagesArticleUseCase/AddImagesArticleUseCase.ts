import { inject, injectable } from "tsyringe";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";
import { ArticleRepository } from "@modules/articles/repositories/infra/ArticleRepository";
import { IArticleRepository } from "@modules/articles/repositories/IArticleRepository";

interface IRequest {
    articleId: string;
    fileNames: string[];
    isMain: boolean;
}

@injectable()
class AddImagesArticleUseCase {
    constructor(
        @inject("StorageProvider")
        private storageProvider: IStorageProvider,
        @inject("ArticleRepository")
        private articleRepository: IArticleRepository
    ) {}

    async execute({ articleId, fileNames, isMain }: IRequest): Promise<void> {
        // const user = await this.articleRepository.findById(articleId);

        if (!articleId) {
            throw new AppError("Article doesn't exist");
        }

        fileNames.map(async (articleImage) => {
            await this.storageProvider.save(articleImage, "article-images");

            await this.articleRepository.saveImageOnArticle(
                articleId,
                articleImage,
                isMain
            );
        });
    }
}

export { AddImagesArticleUseCase };
