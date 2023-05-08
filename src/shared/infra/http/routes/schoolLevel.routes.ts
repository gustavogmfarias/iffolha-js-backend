import { Router } from "express";
import { CreateCourseController } from "@modules/courses/useCases/createCourseUseCase/CreateCourseController";
import { DeleteCoursesFromArticleController } from "@modules/courses/useCases/deleteCoursesFromArticleUseCase/DeleteCoursesFromArticleController";
import { ListCoursesController } from "@modules/courses/useCases/ListCourses/ListCousersController";
import { DeleteCourseController } from "@modules/courses/useCases/deleteCourseUseCase/DeleteCourseController";
import { ListArticlesByCourseController } from "@modules/courses/useCases/ListArticlesByCourse/ListArticlesByCourseController";
import { ListCoursesByLevelController } from "@modules/courses/useCases/ListCoursesByLevel/ListCoursesByLevelController";
import { UpdateCourseController } from "@modules/courses/useCases/updateCourseUseCase/UpdateCourseController";
import { CreateSchoolLevelController } from "@modules/schoolLevel/useCase/createSchoolLevelUseCase/CreateSchoolLevelController";
import { ListSchoolLevelController } from "@modules/schoolLevel/useCase/listSchoolLevel/ListSchoolLevelController";
import { DeleteSchoolLevelController } from "@modules/schoolLevel/useCase/deleteSchoolLevelUseCase/DeleteSchoolLevelController";
import { UpdateSchoolLevelController } from "@modules/schoolLevel/useCase/updateSchoolLevelUseCase/UpdateSchoolLevelController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const schoollevelRoutes = Router();

const createSchoolLevelController = new CreateSchoolLevelController();
const listSchoolLevelController = new ListSchoolLevelController();
const deleteSchoolLevelController = new DeleteSchoolLevelController();
const updateSchoolLevelController = new UpdateSchoolLevelController();

schoollevelRoutes.post(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    createSchoolLevelController.handle
);

schoollevelRoutes.get(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    listSchoolLevelController.handle
);

schoollevelRoutes.delete(
    "/:id",
    ensureAuthenticated,
    ensureAdmin,
    deleteSchoolLevelController.handle
);

schoollevelRoutes.put(
    "/:id",
    ensureAuthenticated,
    ensureAdmin,
    updateSchoolLevelController.handle
);

export { schoollevelRoutes };
