import { Course } from "@prisma/client";

export interface ICoursesRepository {
    createCourse(name: string, level: string): Promise<Course>;
    addCoursesToArticle(articleId: string, coursesId: string[]): Promise<void>;
    list(): Promise<Course[]>;
    findById(id: string): Promise<Course>;
}
