import { Class } from "@prisma/client";

export interface IClassesRepository {
    createClass(name: string, level: string): Promise<Class>;
    addClassesToArticle(articleId: string, classesId: string[]): Promise<void>;
    list(): Promise<Class[]>;
    findById(id: string): Promise<Class>;
}
