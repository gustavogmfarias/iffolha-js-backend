import { Router } from "express";

import { CreateClassController } from "@modules/classes/useCases/createClassUseCase/CreateClassController";
import { ListClassesController } from "@modules/classes/useCases/ListClasses/ListClassesController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const classesRoutes = Router();

const createClassController = new CreateClassController();
const listClassesController = new ListClassesController();
// const deleteClassController = new DeleteClassController();
// const deleteClassesFromArticleController =
//     new DeleteClassesFromArticleController();
// const listArticlesByClassController = new ListArticlesByClassController();
// const listClassesByLevelController = new ListClassesByLevelController();

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

// classesRoutes.get(
//     "/articlesbyclass",
//     ensureAuthenticated,
//     ensureAdmin,
//     listArticlesByClassController.handle
// );
// classesRoutes.get(
//     "/classesbylevel",
//     ensureAuthenticated,
//     ensureAdmin,
//     listClassesByLevelController.handle
// );

// classesRoutes.delete(
//     "/:id",
//     ensureAuthenticated,
//     ensureAdmin,
//     deleteClassController.handle
// );

// classesRoutes.patch(
//     "/deleteallclasses",
//     ensureAuthenticated,
//     ensureAdmin,
//     deleteClassesFromArticleController.handle
// );

export { classesRoutes };
