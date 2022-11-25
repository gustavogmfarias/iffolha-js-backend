export interface IAuthorsRepository {
    addAuthorsToArticle(articleId: string, authorsId: string[]): Promise<void>;
    delAuthorsToArticle(articleId: string, authorsId: string[]): Promise<void>;
}
