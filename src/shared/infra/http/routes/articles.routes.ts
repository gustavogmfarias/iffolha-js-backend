import { Router } from "express";
import uploadConfig from "@config/upload";
import { CreateArticleController } from "@modules/articles/useCases/createArticleUseCase/CreateArticleController";
import { ListArticlesController } from "@modules/articles/useCases/listArticlesUseCase/ListArticlesController";
import { AddImagesArticleController } from "@modules/articles/useCases/addImagesArticleUseCase/AddImagesArticleController";
import multer from "multer";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const articlesRoutes = Router();
const uploadImageArticles = multer(uploadConfig);

const createArticleController = new CreateArticleController();
const listArticlesController = new ListArticlesController();
const addImagesArticleController = new AddImagesArticleController();

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

articlesRoutes.post(
    "/images/:articleId",
    ensureAuthenticated,
    ensureAdmin,
    uploadImageArticles.array("images"),
    addImagesArticleController.handle
);

export { articlesRoutes };
