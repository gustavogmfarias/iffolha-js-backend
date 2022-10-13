export interface IAuthorsRepository {
    addAuthorsToArticle(articleId: string, authors: string[]): Promise<void>;
}
