/* eslint-disable no-restricted-syntax */
import { TextualGenre, TextualGenreOnArticles } from "@prisma/client";
import { prisma } from "@shared/database/prismaClient";
import { ITextualGenreRepository } from "../ITextualGenreRepository";

export class TextualGenreRepository implements ITextualGenreRepository {
    async createTextualGenre(name: string): Promise<TextualGenre> {
        const textualGenre = await prisma.textualGenre.create({
            data: { name },
        });

        return textualGenre;
    }

    async findTextualGenreById(id: string): Promise<TextualGenre> {
        const textualGenre = await prisma.textualGenre.findUnique({
            where: { id },
        });

        return textualGenre;
    }

    async findTextualGenresByIds(id: string[]): Promise<TextualGenre[]> {
        const textualGenres = await prisma.textualGenre.findMany({
            where: { id: { in: id } },
        });

        return textualGenres;
    }

    async findTextualGenreByName(name: string): Promise<TextualGenre> {
        const textualGenre = await prisma.textualGenre.findUnique({
            where: { name },
        });

        return textualGenre;
    }

    async listAllTextualGenresOnArticle(
        articleId: string
    ): Promise<TextualGenreOnArticles[]> {
        let textualGenresOnArticles;

        if (articleId) {
            textualGenresOnArticles =
                await prisma.textualGenreOnArticles.findMany({
                    where: { articleId },
                });
        }

        textualGenresOnArticles =
            await prisma.textualGenreOnArticles.findMany();

        return textualGenresOnArticles;
    }

    async addTextualGenresToArticle(
        articleId: string,
        textualGenresId: string[]
    ): Promise<void> {
        const textualGenresData = [];
        textualGenresId.map((textualGenreFound) => {
            return textualGenresData.push({
                articleId,
                textualGenreId: textualGenreFound,
            });
        });

        for (const textualGenreFound of textualGenresData) {
            // eslint-disable-next-line no-await-in-loop
            await prisma.textualGenreOnArticles.create({
                data: {
                    articleId: textualGenreFound.articleId,
                    textualGenreId: textualGenreFound.textualGenreId,
                },
            });
        }
    }
}
