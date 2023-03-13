import { ArticleWithRelations } from "@modules/articles/repositories/IArticleRepository";
import { TextualGenre, TextualGenreOnArticles } from "@prisma/client";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";

export interface ITextualGenreRepository {
    createTextualGenre(name: string): Promise<TextualGenre>;
    update(id: string, name: string): Promise<TextualGenre>;
    deleteTextualGenre(id: string): Promise<void>;
    deleteAllTextualGenresFromArticle(articleId: string): Promise<void>;

    findTextualGenreByName(name: string): Promise<TextualGenre>;
    findTextualGenreById(id: string): Promise<TextualGenre>;
    findTextualGenresByIds(id: string[]): Promise<TextualGenre[]>;

    listAllTextualGenresOnArticle(
        articleId?: string
    ): Promise<TextualGenreOnArticles[]>;
    listArticlesByTextualGenre(
        { page, perPage }: IPaginationRequestDTO,
        textualGenreName: string,
        articleTitle?: string
    ): Promise<ArticleWithRelations[]>;
    addTextualGenresToArticle(
        articleId: string,
        textualGenresId: string[]
    ): Promise<void>;

    listTextualGenres(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<TextualGenre[]>;

    totalTextualGenres(): Promise<number>;
}
