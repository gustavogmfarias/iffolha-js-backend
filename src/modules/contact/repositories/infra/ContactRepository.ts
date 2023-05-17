import { Contact } from "@prisma/client";
/* eslint-disable no-restricted-syntax */
import { ArticleWithRelations } from "@modules/articles/repositories/IArticleRepository";

import { prisma } from "@shared/database/prismaClient";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { IContactRepository } from "../IContactRepository";

export class ContactRepository implements IContactRepository {
    async create(
        name: string,
        email: string,
        description: string,
        content: string
    ): Promise<Contact> {
        const contact = await prisma.contact.create({
            data: { name, email, description, content },
        });

        return contact;
    }

    async update(
        id: string,
        isAnswered: boolean,
        answeredBy: string
    ): Promise<Contact> {
        const contact = await prisma.contact.update({
            where: { id },
            data: { isAnswered, answeredByUserId: answeredBy },
        });

        return contact;
    }

    async delete(id: string): Promise<void> {
        await prisma.contact.delete({
            where: { id },
        });
    }

    async list(
        { page, perPage }: IPaginationRequestDTO,
        description?: string
    ): Promise<Contact[]> {
        let contacts: Contact[];

        // se não tiver os 3
        if (!page && !perPage && !description) {
            contacts = await prisma.contact.findMany({
                orderBy: {
                    createdAt: "desc",
                },
            });
        } else if (page && perPage && !description) {
            contacts = await prisma.contact.findMany({
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    createdAt: "desc",
                },
            });
        } else if (!page && !page && description) {
            contacts = await prisma.contact.findMany({
                where: {
                    description: {
                        contains: description,
                        mode: "insensitive",
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        } else {
            contacts = await prisma.contact.findMany({
                where: {
                    description: {
                        contains: description,
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

        return contacts;
    }

    async findById(id: string): Promise<Contact> {
        const contact = await prisma.contact.findUnique({
            where: {
                id,
            },
        });

        return contact;
    }
}
