import { Router } from "express";
import { CreateCourseController } from "@modules/courses/useCases/createCourseUseCase/CreateCourseController";
import { DeleteCoursesFromArticleController } from "@modules/courses/useCases/deleteCoursesFromArticleUseCase/DeleteCoursesFromArticleController";
import { ListCoursesController } from "@modules/courses/useCases/ListCourses/ListCousersController";
import { DeleteCourseController } from "@modules/courses/useCases/deleteCourseUseCase/DeleteCourseController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const coursesRoutes = Router();

const createCourseController = new CreateCourseController();
const listCoursesController = new ListCoursesController();
const deleteCourseController = new DeleteCourseController();
const deleteCoursesFromArticleController =
    new DeleteCoursesFromArticleController();
// const listArticlesByCourseController = new ListArticlesByCourseController();

coursesRoutes.post(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    createCourseController.handle
);

coursesRoutes.get(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    listCoursesController.handle
);

// coursesRoutes.get(
//     "/articlesbycourse",
//     ensureAuthenticated,
//     ensureAdmin,
//     listArticlesByCourseController.handle
// );

coursesRoutes.delete(
    "/:id",
    ensureAuthenticated,
    ensureAdmin,
    deleteCourseController.handle
);

coursesRoutes.patch(
    "/deleteallcourses",
    ensureAuthenticated,
    ensureAdmin,
    deleteCoursesFromArticleController.handle
);

export { coursesRoutes };
