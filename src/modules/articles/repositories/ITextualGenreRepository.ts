import { TextualGenre, TextualGenreOnArticles } from "@prisma/client";

export interface ITextualGenreRepository {
    createTextualGenre(name: string): Promise<TextualGenre>;
    findTextualGenreByName(name: string): Promise<TextualGenre>;
    findTextualGenreById(id: string): Promise<TextualGenre>;
    findTextualGenresByIds(id: string[]): Promise<TextualGenre[]>;
    listAllTextualGenresOnArticle(
        articleId?: string
    ): Promise<TextualGenreOnArticles[]>;
    addTextualGenresToArticle(
        articleId: string,
        textualGenresId: string[]
    ): Promise<void>;
}
