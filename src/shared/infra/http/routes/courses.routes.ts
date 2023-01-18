import { Router } from "express";
import { CreateCourseController } from "@modules/courses/useCases/createCourseUseCase/CreateCourseController";
import { DeleteCoursesFromArticleController } from "@modules/courses/useCases/deleteCoursesFromArticleUseCase/DeleteCoursesFromArticleController";
import { ListCoursesController } from "@modules/courses/useCases/ListCourses/ListCousersController";
import { DeleteCourseController } from "@modules/courses/useCases/deleteCourseUseCase/DeleteCourseController";
import { ListArticlesByCourseController } from "@modules/courses/useCases/ListArticlesByCourse/ListArticlesByCourseController";
import { ListCoursesByLevelController } from "@modules/courses/useCases/ListCoursesByLevel/ListCoursesByLevelController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const coursesRoutes = Router();

const createCourseController = new CreateCourseController();
const listCoursesController = new ListCoursesController();
const deleteCourseController = new DeleteCourseController();
const deleteCoursesFromArticleController =
    new DeleteCoursesFromArticleController();
const listArticlesByCourseController = new ListArticlesByCourseController();
const listCoursesByLevelController = new ListCoursesByLevelController();

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

coursesRoutes.get(
    "/articlesbycourse",
    ensureAuthenticated,
    ensureAdmin,
    listArticlesByCourseController.handle
);
coursesRoutes.get(
    "/coursesbylevel",
    ensureAuthenticated,
    ensureAdmin,
    listCoursesByLevelController.handle
);

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
