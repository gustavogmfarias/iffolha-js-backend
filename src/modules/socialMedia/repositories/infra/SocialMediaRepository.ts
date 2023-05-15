import { SocialMedia } from "@prisma/client";
/* eslint-disable no-restricted-syntax */
import { ArticleWithRelations } from "@modules/articles/repositories/IArticleRepository";

import { prisma } from "@shared/database/prismaClient";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { ISocialMediaRepository } from "../ISocialMediaRepository";

export class SocialMediaRepository implements ISocialMediaRepository {
    async create(name: string, url: string): Promise<SocialMedia> {
        const socialMedia = await prisma.socialMedia.create({
            data: { name, url },
        });

        return socialMedia;
    }

    async update(id: string, name: string, url: string): Promise<SocialMedia> {
        const socialMedia = await prisma.socialMedia.update({
            where: { id },
            data: { name, url },
        });

        return socialMedia;
    }

    async delete(id: string): Promise<void> {
        await prisma.socialMedia.delete({
            where: { id },
        });
    }

    async list(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<SocialMedia[]> {
        let socialMedias: SocialMedia[];

        // se não tiver os 3
        if (!page && !perPage && !name) {
            socialMedias = await prisma.socialMedia.findMany({
                orderBy: {
                    name: "asc",
                },
            });
        } else if (page && perPage && !name) {
            socialMedias = await prisma.socialMedia.findMany({
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    name: "asc",
                },
            });
        } else if (!page && !page && name) {
            socialMedias = await prisma.socialMedia.findMany({
                where: {
                    name: {
                        contains: name,
                        mode: "insensitive",
                    },
                },
                orderBy: {
                    name: "asc",
                },
            });
        } else {
            socialMedias = await prisma.socialMedia.findMany({
                where: {
                    name: {
                        contains: name,
                        mode: "insensitive",
                    },
                },
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    name: "asc",
                },
            });
        }

        return socialMedias;
    }

    async findByName(name: string): Promise<SocialMedia> {
        const socialMedia = await prisma.socialMedia.findUnique({
            where: {
                name,
            },
        });

        return socialMedia;
    }

    async findById(id: string): Promise<SocialMedia> {
        const socialMedia = await prisma.socialMedia.findUnique({
            where: {
                id,
            },
        });

        return socialMedia;
    }
}
