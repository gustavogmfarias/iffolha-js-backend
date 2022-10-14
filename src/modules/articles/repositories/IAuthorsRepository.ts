export interface IAuthorsRepository {
    addAuthorsToArticle(articleId: string, authorsId: string[]): Promise<void>;
}
