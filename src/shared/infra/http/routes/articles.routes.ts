import { Router } from "express";
import uploadConfig from "@config/upload";
import { CreateArticleController } from "@modules/articles/useCases/createArticleUseCase/CreateArticleController";
import { ListArticlesController } from "@modules/articles/useCases/listArticlesUseCase/ListArticlesController";
import { AddImagesArticleController } from "@modules/articles/useCases/addImagesArticleUseCase/AddImagesArticleController";
import multer from "multer";
import { DeleteArticleController } from "@modules/articles/useCases/deleteArticleUseCase/DeleteArticleController";
import { UpdateArticleController } from "@modules/articles/useCases/updateArticleUseCase/UpdateArticleController";
import { FindArticleByIdController } from "@modules/articles/useCases/findArticleById/FindArticleByIdController";
import { DeleteAuthorsOfAnArticleController } from "@modules/articles/useCases/deleteAuthorsOfAnArticleUseCase/DeleteAuthorsOfAnArticleController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const articlesRoutes = Router();
const uploadImageArticles = multer(uploadConfig);

const createArticleController = new CreateArticleController();
const listArticlesController = new ListArticlesController();
const addImagesArticleController = new AddImagesArticleController();
const deleteArticleController = new DeleteArticleController();
const updateArticleController = new UpdateArticleController();
const findArticleByIdController = new FindArticleByIdController();
const deleteAuthorsOfAnArticleController =
    new DeleteAuthorsOfAnArticleController();

articlesRoutes.post(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    createArticleController.handle
);

articlesRoutes.patch(
    "/deleteallauthors",
    ensureAuthenticated,
    ensureAdmin,
    deleteAuthorsOfAnArticleController.handle
);

articlesRoutes.patch(
    "/:articleId",
    ensureAuthenticated,
    ensureAdmin,
    updateArticleController.handle
);

articlesRoutes.get(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    listArticlesController.handle
);

articlesRoutes.get(
    "/:id",
    ensureAuthenticated,
    ensureAdmin,
    findArticleByIdController.handle
);

articlesRoutes.delete(
    "/:id",
    ensureAuthenticated,
    ensureAdmin,
    deleteArticleController.handle
);

articlesRoutes.post(
    "/images/:articleId",
    ensureAuthenticated,
    ensureAdmin,
    uploadImageArticles.array("images"),
    addImagesArticleController.handle
);

export { articlesRoutes };
