import { Router } from "express";

import { CreateClassController } from "@modules/classes/useCases/createClassUseCase/CreateClassController";
import { ListClassesController } from "@modules/classes/useCases/ListClasses/ListClassesController";
import { DeleteClassesFromArticleController } from "@modules/classes/useCases/deleteClassesFromArticleUseCase/DeleteClassesFromArticleController";
import { DeleteClassController } from "@modules/classes/useCases/deleteClassUseCase/DeleteClassController";
import { ListArticlesByClassController } from "@modules/classes/useCases/ListArticlesByClass/ListArticlesByClassController";
import { ListClassesByCourseController } from "@modules/classes/useCases/ListClassesByCourse/ListClassesByCourseController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const classesRoutes = Router();

const createClassController = new CreateClassController();
const listClassesController = new ListClassesController();
const deleteClassController = new DeleteClassController();
const deleteClassesFromArticleController =
    new DeleteClassesFromArticleController();
const listArticlesByClassController = new ListArticlesByClassController();
const listClassesByCourseController = new ListClassesByCourseController();

classesRoutes.post(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    createClassController.handle
);

classesRoutes.get(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    listClassesController.handle
);

classesRoutes.get(
    "/articlesbyclass",
    ensureAuthenticated,
    ensureAdmin,
    listArticlesByClassController.handle
);
classesRoutes.get(
    "/classesbycourse",
    ensureAuthenticated,
    ensureAdmin,
    listClassesByCourseController.handle
);

classesRoutes.delete(
    "/:id",
    ensureAuthenticated,
    ensureAdmin,
    deleteClassController.handle
);

classesRoutes.patch(
    "/deleteallclasses",
    ensureAuthenticated,
    ensureAdmin,
    deleteClassesFromArticleController.handle
);

export { classesRoutes };
