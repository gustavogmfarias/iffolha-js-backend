import { Router } from "express";

import { CreateTextualGenreController } from "@modules/textualGenre/useCases/createTextualGenreUseCase/CreateTextualGenreController";

import { ListTextualGenresController } from "@modules/textualGenre/useCases/ListTextualGenres/ListTextualGenresController";
import { DeleteTextualGenresFromArticleController } from "@modules/textualGenre/useCases/deleteTextualGenresFromArticleUseCase/DeleteTextualGenreFromArticleController";
import { DeleteTextualGenreController } from "@modules/textualGenre/useCases/deleteTextualGenreUseCase/DeleteTextualGenreController";
import { ListArticlesByTextualGenreController } from "@modules/textualGenre/useCases/ListArticlesByTextualGenre/ListArticlesByTextualGenreController";
import { UpdateTextualGenreController } from "@modules/textualGenre/useCases/updateTextualGenreUseCase/UpdateTextualGenreController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const textualGenreRoutes = Router();

const createTextualGenreController = new CreateTextualGenreController();
const listTextualGenresController = new ListTextualGenresController();
const deleteTextualGenreController = new DeleteTextualGenreController();
const listArticlesByTextualGenreController =
    new ListArticlesByTextualGenreController();
const deleteTextualGenresFromArticleController =
    new DeleteTextualGenresFromArticleController();
const updateTextualGenreController = new UpdateTextualGenreController();

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

textualGenreRoutes.get(
    "/articlesbytextualgenre",
    ensureAuthenticated,
    ensureAdmin,
    listArticlesByTextualGenreController.handle
);

textualGenreRoutes.delete(
    "/:id",
    ensureAuthenticated,
    ensureAdmin,
    deleteTextualGenreController.handle
);

textualGenreRoutes.put(
    "/:id",
    ensureAuthenticated,
    ensureAdmin,
    updateTextualGenreController.handle
);

textualGenreRoutes.patch(
    "/deletealltextualgenres",
    ensureAuthenticated,
    ensureAdmin,
    deleteTextualGenresFromArticleController.handle
);

export { textualGenreRoutes };
