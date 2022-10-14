import { Router } from "express";
import { CreateArticleController } from "@modules/articles/useCases/createArticleUseCase/CreateArticleController";
import { ListArticlesController } from "@modules/articles/useCases/listArticlesUseCase/ListArticlesController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const articlesRoutes = Router();

const createArticleController = new CreateArticleController();
const listArticlesController = new ListArticlesController();

articlesRoutes.post(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    createArticleController.handle
);
articlesRoutes.get(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    listArticlesController.handle
);

export { articlesRoutes };
