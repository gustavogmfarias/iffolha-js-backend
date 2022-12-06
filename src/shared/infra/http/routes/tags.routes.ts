import { Router } from "express";
import { CreateTagController } from "@modules/tags/useCases/createTagUseCase/CreateTagController";
import { ListTagsController } from "@modules/tags/useCases/ListTags/ListTagsController";
import { DeleteTagController } from "@modules/tags/useCases/deleteTagUseCase/DeleteTagController";
import { DeleteTagFromArticleController } from "@modules/tags/useCases/deleteTagFromArticleUseCase/DeleteTagFromArticleController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const tagsRoutes = Router();

const createTagController = new CreateTagController();
const listTagsController = new ListTagsController();
const deleteTagController = new DeleteTagController();
const deleteTagFromArticleController = new DeleteTagFromArticleController();

tagsRoutes.get(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    listTagsController.handle
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
