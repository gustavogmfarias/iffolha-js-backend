import { inject, injectable } from "tsyringe";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { AppError } from "@shared/errors/AppError";
import { ArticleRepository } from "@modules/articles/repositories/infra/ArticleRepository";
import { IArticleRepository } from "@modules/articles/repositories/IArticleRepository";

interface IRequest {
    articleId: string;
    image: string;
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

    async execute({ articleId, image, isMain }: IRequest): Promise<void> {
        const article = await this.articleRepository.findById(articleId);

        if (!article) {
            throw new AppError("Article doesn't exist");
        }

        if (article.mainImage) {
            await this.storageProvider.delete(
                article.mainImage,
                "article-images"
            );
        }

        await this.storageProvider.save(image, "article-images");

        await this.articleRepository.update(article.id, {
            ...article,
            mainImage: image,
        });
    }
}

export { AddImagesArticleUseCase };
