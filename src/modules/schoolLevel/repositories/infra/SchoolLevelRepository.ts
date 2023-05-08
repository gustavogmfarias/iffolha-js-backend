import { SchoolLevel } from "@prisma/client";
/* eslint-disable no-restricted-syntax */
import { ArticleWithRelations } from "@modules/articles/repositories/IArticleRepository";

import { prisma } from "@shared/database/prismaClient";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";
import { ISchoolLevelRepository } from "../ISchoolLevelRepository";

export class SchoolLevelRepository implements ISchoolLevelRepository {
    async create(name: string): Promise<SchoolLevel> {
        const schoolLevel = await prisma.schoolLevel.create({
            data: { name },
        });

        return schoolLevel;
    }

    async update(id: string, name: string): Promise<SchoolLevel> {
        const schoolLevel = await prisma.schoolLevel.update({
            where: { id },
            data: { name },
        });

        return schoolLevel;
    }

    async delete(id: string): Promise<void> {
        await prisma.schoolLevel.delete({
            where: { id },
        });
    }

    async list(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<SchoolLevel[]> {
        let schoolLevels: SchoolLevel[];

        // se não tiver os 3
        if (!page && !perPage && !name) {
            schoolLevels = await prisma.schoolLevel.findMany({
                orderBy: {
                    name: "asc",
                },
            });
        } else if (page && perPage && !name) {
            schoolLevels = await prisma.schoolLevel.findMany({
                take: Number(perPage),
                skip: (Number(page) - 1) * Number(perPage),
                orderBy: {
                    name: "asc",
                },
            });
        } else if (!page && !page && name) {
            schoolLevels = await prisma.schoolLevel.findMany({
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
            schoolLevels = await prisma.schoolLevel.findMany({
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

        return schoolLevels;
    }

    async findByName(name: string): Promise<SchoolLevel> {
        const schoolLevel = await prisma.schoolLevel.findUnique({
            where: {
                name,
            },
        });

        return schoolLevel;
    }

    async findById(id: string): Promise<SchoolLevel> {
        const schoolLevel = await prisma.schoolLevel.findUnique({
            where: {
                id,
            },
        });

        return schoolLevel;
    }
}
