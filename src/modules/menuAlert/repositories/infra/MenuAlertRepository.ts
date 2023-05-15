import { MenuAlert } from "@prisma/client";
/* eslint-disable no-restricted-syntax */
import { ArticleWithRelations } from "@modules/articles/repositories/IArticleRepository";

import { prisma } from "@shared/database/prismaClient";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { IMenuAlertRepository } from "../IMenuAlertRepository";

export class MenuAlertRepository implements IMenuAlertRepository {
    async create(
        content: string,
        color: string,
        menuAlertIsActive: boolean
    ): Promise<MenuAlert> {
        const menuAlert = await prisma.menuAlert.create({
            data: { content, color, menuAlertIsActive },
        });

        return menuAlert;
    }

    async update(
        id: string,
        content: string,
        color: string,
        menuAlertIsActive: boolean
    ): Promise<MenuAlert> {
        const menuAlert = await prisma.menuAlert.update({
            where: { id },
            data: { content, color, menuAlertIsActive },
        });

        return menuAlert;
    }

    async delete(id: string): Promise<void> {
        await prisma.menuAlert.delete({
            where: { id },
        });
    }

    async list(
        { page, perPage }: IPaginationRequestDTO,
        content?: string
    ): Promise<MenuAlert[]> {
        let menuAlerts: MenuAlert[];

        // se não tiver os 3
        if (!page && !perPage && !content) {
            menuAlerts = await prisma.menuAlert.findMany({
                orderBy: {
                    content: "asc",
                },
            });
        } else if (page && perPage && !content) {
            menuAlerts = await prisma.menuAlert.findMany({
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    content: "asc",
                },
            });
        } else if (!page && !page && content) {
            menuAlerts = await prisma.menuAlert.findMany({
                where: {
                    content: {
                        contains: content,
                        mode: "insensitive",
                    },
                },
                orderBy: {
                    content: "asc",
                },
            });
        } else {
            menuAlerts = await prisma.menuAlert.findMany({
                where: {
                    content: {
                        contains: content,
                        mode: "insensitive",
                    },
                },
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    content: "asc",
                },
            });
        }

        return menuAlerts;
    }

    async findById(id: string): Promise<MenuAlert> {
        const menuAlert = await prisma.menuAlert.findUnique({
            where: {
                id,
            },
        });

        return menuAlert;
    }
}
