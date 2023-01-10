import { Router } from "express";
import { CreateCategoryController } from "@modules/categories/useCases/createCategoryUseCase/CreateCategoryController";
import { ListCategoriesController } from "@modules/categories/useCases/ListCategories/ListCategoriesController";
import { DeleteCategoryController } from "@modules/categories/useCases/deleteCategoryUseCase/DeleteCategoryController";
import { ListArticlesByCategoryController } from "@modules/categories/useCases/ListArticlesByCategory/ListArticlesByCategoryController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const categoryRoutes = Router();

const createCategoryController = new CreateCategoryController();
const listCategoriesController = new ListCategoriesController();
const deleteCategoryController = new DeleteCategoryController();
const listArticlesByCategoryController = new ListArticlesByCategoryController();

categoryRoutes.post(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    createCategoryController.handle
);
categoryRoutes.get(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    listCategoriesController.handle
);

categoryRoutes.get(
    "/articlesbycategory",
    ensureAuthenticated,
    ensureAdmin,
    listArticlesByCategoryController.handle
);

categoryRoutes.delete(
    "/:id",
    ensureAuthenticated,
    ensureAdmin,
    deleteCategoryController.handle
);

export { categoryRoutes };
