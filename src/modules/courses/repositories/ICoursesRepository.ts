import { ArticleWithRelations } from "@modules/articles/repositories/IArticleRepository";
import { Course, CoursesOnArticles, SchoolLevel } from "@prisma/client";
import { IPaginationRequestDTO } from "@shared/dtos/IPaginationRequestDTO";

export interface ICoursesRepository {
    createCourse(name: string, schoolLevel: SchoolLevel): Promise<Course>;
    deleteCourse(id: string): Promise<void>;
    deleteAllCoursesFromArticle(articleId: string): Promise<void>;

    findCourseByName(name: string): Promise<Course>;
    findCourseById(id: string): Promise<Course>;
    findCoursesByIds(id: string[]): Promise<Course[]>;

    listAllCoursesOnArticle(articleId?: string): Promise<CoursesOnArticles[]>;
    listArticlesByCourse(
        { page, perPage }: IPaginationRequestDTO,
        courseName: string,
        articleTitle?: string
    ): Promise<ArticleWithRelations[]>;
    listCoursesByLevel(
        { page, perPage }: IPaginationRequestDTO,
        level: string
    ): Promise<Course[]>;
    addCoursesToArticle(articleId: string, coursesId: string[]): Promise<void>;

    listCourses(
        { page, perPage }: IPaginationRequestDTO,
        name?: string
    ): Promise<Course[]>;

    totalCourses(): Promise<number>;
}
