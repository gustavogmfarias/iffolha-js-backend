import { ICoursesRepository } from "@modules/courses/repositories/ICoursesRepository";
import { Log, Course } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    course: Course;
    log: Log;
}

@injectable()
class DeleteCourseUseCase {
    constructor(
        @inject("CoursesRepository")
        private coursesRepository: ICoursesRepository,
        @inject("LogProvider")
        private logProvider: ILogProvider
    ) {}

    async execute(
        userAdminId: string,
        courseToDeleteId: string
    ): Promise<IResponse> {
        const course = await this.coursesRepository.findCourseById(
            courseToDeleteId
        );

        if (!course) {
            throw new AppError("Course doesn't exists", 404);
        }
        let courseDeleted;

        try {
            courseDeleted =
                this.coursesRepository.deleteCourse(courseToDeleteId);
        } catch (err) {
            throw new AppError("Course wasn't deleted", 401);
        }

        const log = await this.logProvider.create({
            logRepository: "COURSE",
            description: `Course successfully deleted!`,
            previousContent: JSON.stringify(course),
            contentEdited: JSON.stringify(course),
            editedByUserId: userAdminId,
            modelEditedId: course.id,
        });

        return { course, log };
    }
}

export { DeleteCourseUseCase };
