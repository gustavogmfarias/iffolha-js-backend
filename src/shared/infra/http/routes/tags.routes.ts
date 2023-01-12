import { Router } from "express";
import { CreateTagController } from "@modules/tags/useCases/createTagUseCase/CreateTagController";
import { ListTagsController } from "@modules/tags/useCases/ListTags/ListTagsController";
import { DeleteTagController } from "@modules/tags/useCases/deleteTagUseCase/DeleteTagController";
import { DeleteTagFromArticleController } from "@modules/tags/useCases/deleteTagFromArticleUseCase/DeleteTagFromArticleController";

import { ListArticlesByTagController } from "@modules/tags/useCases/ListArticlesByTag/ListArticlesByTagController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const tagsRoutes = Router();

const createTagController = new CreateTagController();
const listTagsController = new ListTagsController();
const deleteTagController = new DeleteTagController();
const deleteTagFromArticleController = new DeleteTagFromArticleController();
const listArticlesByTagController = new ListArticlesByTagController();

tagsRoutes.get(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    listTagsController.handle
);

tagsRoutes.get(
    "/articlesbytag",
    ensureAuthenticated,
    ensureAdmin,
    listArticlesByTagController.handle
);

tagsRoutes.post(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    createTagController.handle
);
tagsRoutes.delete(
    "/:name",
    ensureAuthenticated,
    ensureAdmin,
    deleteTagController.handle
);

tagsRoutes.patch(
    "/deletealltags",
    ensureAuthenticated,
    ensureAdmin,
    deleteTagFromArticleController.handle
);

export { tagsRoutes };
