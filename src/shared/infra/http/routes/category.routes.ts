import { Router } from "express";
import { CreateCategoryController } from "@modules/categories/useCases/createCategoryUseCase/CreateCategoryController";
import { ListCategoriesController } from "@modules/categories/useCases/ListCategories/ListCategoriesController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const categoryRoutes = Router();

const createCategoryController = new CreateCategoryController();
const listCategoriesController = new ListCategoriesController();

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

export { categoryRoutes };
