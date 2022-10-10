import { IArticleImagesRepository } from "../IArticleImagesRepository";

export class ArticleImagesRepository implements IArticleImagesRepository {
    create(ArticleId: string, isMain: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
