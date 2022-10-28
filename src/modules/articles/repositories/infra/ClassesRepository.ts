/* eslint-disable no-restricted-syntax */
import { Class } from "@prisma/client";
import { prisma } from "@shared/database/prismaClient";
import { IClassesRepository } from "../IClassesRepository";

export class ClassesRepository implements IClassesRepository {
    async createClass(name: string, courseId: string): Promise<Class> {
        const newClass = await prisma.class.create({
            data: { name, courseId },
        });

        return newClass;
    }

    async addClassesToArticle(
        articleId: string,
        classesId: string[]
    ): Promise<void> {
        const classesData = [];
        classesId.map((classFound) => {
            return classesData.push({
                articleId,
                classId: classFound,
            });
        });

        for (const classFound of classesData) {
            // eslint-disable-next-line no-await-in-loop
            await prisma.classOnArticles.create({
                data: {
                    articleId: classFound.articleId,
                    classId: classFound.classId,
                },
            });
        }
    }

    async list(): Promise<Class[]> {
        const classes = await prisma.class.findMany();

        return classes;
    }

    async findById(id: string): Promise<Class> {
        const classFound = await prisma.class.findUnique({ where: { id } });

        return classFound;
    }
}
