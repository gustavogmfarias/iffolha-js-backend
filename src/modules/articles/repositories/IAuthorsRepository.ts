export interface IAuthorsRepository {
    addAuthorsToArticle(articleId: string, authorsId: string[]): Promise<void>;
    deleteAllAuthorsOfAnArticle(articleId: string): Promise<void>;
}
