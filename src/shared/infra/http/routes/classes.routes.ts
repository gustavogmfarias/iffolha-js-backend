import { Router } from "express";
// import { CreateCourseController } from "@modules/classes/useCases/createCourseUseCase/CreateCourseController";
// import { DeleteCoursesFromArticleController } from "@modules/classes/useCases/deleteCoursesFromArticleUseCase/DeleteCoursesFromArticleController";
// import { ListCoursesController } from "@modules/classes/useCases/ListCourses/ListCousersController";
// import { DeleteCourseController } from "@modules/classes/useCases/deleteCourseUseCase/DeleteCourseController";
// import { ListArticlesByCourseController } from "@modules/classes/useCases/ListArticlesByCourse/ListArticlesByCourseController";
// import { ListCoursesByLevelController } from "@modules/classes/useCases/ListCoursesByLevel/ListCoursesByLevelController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const classesRoutes = Router();

// const createCourseController = new CreateCourseController();
// const listCoursesController = new ListCoursesController();
// const deleteCourseController = new DeleteCourseController();
// const deleteCoursesFromArticleController =
//     new DeleteCoursesFromArticleController();
// const listArticlesByCourseController = new ListArticlesByCourseController();
// const listCoursesByLevelController = new ListCoursesByLevelController();

// classesRoutes.post(
//     "/",
//     ensureAuthenticated,
//     ensureAdmin,
//     createCourseController.handle
// );

// classesRoutes.get(
//     "/",
//     ensureAuthenticated,
//     ensureAdmin,
//     listCoursesController.handle
// );

// classesRoutes.get(
//     "/articlesbycourse",
//     ensureAuthenticated,
//     ensureAdmin,
//     listArticlesByCourseController.handle
// );
// classesRoutes.get(
//     "/classesbylevel",
//     ensureAuthenticated,
//     ensureAdmin,
//     listCoursesByLevelController.handle
// );

// classesRoutes.delete(
//     "/:id",
//     ensureAuthenticated,
//     ensureAdmin,
//     deleteCourseController.handle
// );

// classesRoutes.patch(
//     "/deleteallclasses",
//     ensureAuthenticated,
//     ensureAdmin,
//     deleteCoursesFromArticleController.handle
// );

export { classesRoutes };
