import { Router } from "express";
import { CreateArticleController } from "@modules/articles/useCases/addImagesArticleUseCase/createArticleUseCase/CreateArticleController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const articlesRoutes = Router();

const createArticleController = new CreateArticleController();

articlesRoutes.post(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    createArticleController.handle
);

export { articlesRoutes };
