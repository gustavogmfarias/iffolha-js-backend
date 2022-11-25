export interface IArticleImagesRepository {
    create(ArticleId: string, isMain: boolean): Promise<void>;
}
