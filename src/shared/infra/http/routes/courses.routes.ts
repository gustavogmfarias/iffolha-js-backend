import { Router } from "express";
import { CreateCourseController } from "@modules/courses/useCases/createCourseUseCase/CreateCourseController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const coursesRoutes = Router();

const createCourseController = new CreateCourseController();
// const listCoursesController = new ListCoursesController();
// const deleteCourseController = new DeleteCourseController();
// const deleteCourseFromArticleController =
//     new DeleteCourseFromArticleController();
// const listArticlesByCourseController = new ListArticlesByCourseController();

coursesRoutes.post(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    createCourseController.handle
);

// coursesRoutes.get(
//     "/",
//     ensureAuthenticated,
//     ensureAdmin,
//     listCoursesController.handle
// );

// coursesRoutes.get(
//     "/articlesbycourse",
//     ensureAuthenticated,
//     ensureAdmin,
//     listArticlesByCourseController.handle
// );

// coursesRoutes.delete(
//     "/:name",
//     ensureAuthenticated,
//     ensureAdmin,
//     deleteCourseController.handle
// );

// coursesRoutes.patch(
//     "/deleteallcourses",
//     ensureAuthenticated,
//     ensureAdmin,
//     deleteCourseFromArticleController.handle
// );

export { coursesRoutes };
