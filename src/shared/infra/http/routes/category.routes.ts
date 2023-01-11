import { Router } from "express";
import { CreateCategoryController } from "@modules/categories/useCases/createCategoryUseCase/CreateCategoryController";
import { ListCategoriesController } from "@modules/categories/useCases/ListCategories/ListCategoriesController";
import { DeleteCategoryController } from "@modules/categories/useCases/deleteCategoryUseCase/DeleteCategoryController";
import { ListArticlesByCategoryController } from "@modules/categories/useCases/ListArticlesByCategory/ListArticlesByCategoryController";
import { DeleteCategoriesFromArticleController } from "@modules/categories/useCases/deleteCategoriesFromArticleUseCase/DeleteCategoriesFromArticleController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const categoryRoutes = Router();

const createCategoryController = new CreateCategoryController();
const listCategoriesController = new ListCategoriesController();
const deleteCategoryController = new DeleteCategoryController();
const listArticlesByCategoryController = new ListArticlesByCategoryController();
const deleteCategoriesFromArticleController =
    new DeleteCategoriesFromArticleController();

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

categoryRoutes.patch(
    "/deleteallcategories",
    ensureAuthenticated,
    ensureAdmin,
    deleteCategoriesFromArticleController.handle
);

export { categoryRoutes };
