/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { prisma } from "@shared/database/prismaClient";
import { IAuthorsRepository } from "../IAuthorsRepository";

export class AuthorsRepository implements IAuthorsRepository {
    async addAuthorsToArticle(
        articleId: string,
        authorsId: string[]
    ): Promise<void> {
        const authorsData = [];
        authorsId.map((author) => {
            return authorsData.push({
                articleId,
                authorId: author,
            });
        });

        for (const author of authorsData) {
            // eslint-disable-next-line no-await-in-loop
            await prisma.authorsOnArticles.create({
                data: {
                    ArticleId: author.articleId,
                    authorId: author.authorId,
                },
            });
        }
    }
}
