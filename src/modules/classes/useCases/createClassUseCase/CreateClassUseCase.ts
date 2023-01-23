import { ICoursesRepository } from "@modules/courses/repositories/ICoursesRepository";
import { Course, Log, SchoolLevel } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IResponse {
    course: Course;
    log: Log;
}

@injectable()
class CreateCourseUseCase {
    constructor(
        @inject("CoursesRepository")
        private coursesRepository: ICoursesRepository,
        @inject("LogProvider") private logProvider: ILogProvider
    ) {}

    async execute(
        name: string,
        userAdminId: string,
        schoolLevel: SchoolLevel
    ): Promise<IResponse> {
        let course = await this.coursesRepository.findCourseByName(name);

        if (course) {
            throw new AppError("Course already exists", 400);
        }

        try {
            course = await this.coursesRepository.createCourse(
                name,
                schoolLevel
            );
        } catch (err) {
            throw new AppError(err.message, 400);
        }

        const log = await this.logProvider.create({
            logRepository: "COURSE",
            description: `Course created successfully!`,
            previousContent: JSON.stringify(course),
            contentEdited: JSON.stringify(course),
            editedByUserId: userAdminId,
            modelEditedId: course.id,
        });

        return { course, log };
    }
}

export { CreateCourseUseCase };
