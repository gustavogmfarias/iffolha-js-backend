import { Newsletter } from "@prisma/client";
/* eslint-disable no-restricted-syntax */
import { ArticleWithRelations } from "@modules/articles/repositories/IArticleRepository";

import { prisma } from "@shared/database/prismaClient";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { INewsletterRepository } from "../INewsletterRepository";

export class NewsletterRepository implements INewsletterRepository {
    async create(name: string, email: string): Promise<Newsletter> {
        const newsletter = await prisma.newsletter.create({
            data: { name, email },
        });

        return newsletter;
    }

    async delete(id: string): Promise<void> {
        await prisma.newsletter.delete({
            where: { id },
        });
    }

    async list(
        { page, perPage }: IPaginationRequestDTO,
        email?: string
    ): Promise<Newsletter[]> {
        let newsletters: Newsletter[];

        // se não tiver os 3
        if (!page && !perPage && !email) {
            newsletters = await prisma.newsletter.findMany({
                orderBy: {
                    createdAt: "desc",
                },
            });
        } else if (page && perPage && !email) {
            newsletters = await prisma.newsletter.findMany({
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    createdAt: "desc",
                },
            });
        } else if (!page && !page && email) {
            newsletters = await prisma.newsletter.findMany({
                where: {
                    email: {
                        contains: email,
                        mode: "insensitive",
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        } else {
            newsletters = await prisma.newsletter.findMany({
                where: {
                    email: {
                        contains: email,
                        mode: "insensitive",
                    },
                },
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    createdAt: "desc",
                },
            });
        }

        return newsletters;
    }

    async findById(id: string): Promise<Newsletter> {
        const newsletter = await prisma.newsletter.findUnique({
            where: {
                id,
            },
        });

        return newsletter;
    }

    async findByEmail(email: string): Promise<Newsletter> {
        const newsletter = await prisma.newsletter.findUnique({
            where: {
                email,
            },
        });

        return newsletter;
    }
}
