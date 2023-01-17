import { Router } from "express";

import { CreateTextualGenreController } from "@modules/textualGenre/useCases/createTextualGenreUseCase/CreateTextualGenreController";

import { ListTextualGenresController } from "@modules/textualGenre/useCases/ListTextualGenres/ListTextualGenresController";
import { DeleteTextualGenresFromArticleController } from "@modules/textualGenre/useCases/deleteTextualGenresFromArticleUseCase/DeleteTextualGenreFromArticleController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const textualGenreRoutes = Router();

const createTextualGenreController = new CreateTextualGenreController();
const listTextualGenresController = new ListTextualGenresController();
// const deleteTextualGenreController = new DeleteTextualGenreController();
// const listArticlesByTextualGenreController =
//     new ListArticlesByTextualGenreController();
const deleteTextualGenresFromArticleController =
    new DeleteTextualGenresFromArticleController();

textualGenreRoutes.post(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    createTextualGenreController.handle
);
textualGenreRoutes.get(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    listTextualGenresController.handle
);

// textualGenreRoutes.get(
//     "/articlesbytextualgenre",
//     ensureAuthenticated,
//     ensureAdmin,
//     listArticlesByTextualGenreController.handle
// );

// textualGenreRoutes.delete(
//     "/:id",
//     ensureAuthenticated,
//     ensureAdmin,
//     deleteTextualGenreController.handle
// );

textualGenreRoutes.patch(
    "/deletealltextualgenres",
    ensureAuthenticated,
    ensureAdmin,
    deleteTextualGenresFromArticleController.handle
);

export { textualGenreRoutes };
