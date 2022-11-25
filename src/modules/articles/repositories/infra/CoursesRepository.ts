/* eslint-disable no-restricted-syntax */
import { Course } from "@prisma/client";
import { prisma } from "@shared/database/prismaClient";
import { ICoursesRepository } from "../ICoursesRepository";

export class CoursesRepository implements ICoursesRepository {
    async createCourse(name: string, level: string): Promise<Course> {
        const course = await prisma.course.create({ data: { name, level } });

        return course;
    }

    async addCoursesToArticle(
        articleId: string,
        coursesId: string[]
    ): Promise<void> {
        const coursesData = [];
        coursesId.map((course) => {
            return coursesData.push({
                articleId,
                courseId: course,
            });
        });

        for (const course of coursesData) {
            // eslint-disable-next-line no-await-in-loop
            await prisma.coursesOnArticles.create({
                data: {
                    articleId: course.articleId,
                    courseId: course.courseId,
                },
            });
        }
    }

    async list(): Promise<Course[]> {
        const courses = await prisma.course.findMany();

        return courses;
    }

    async findById(id: string): Promise<Course> {
        const course = await prisma.course.findUnique({ where: { id } });

        return course;
    }
}
