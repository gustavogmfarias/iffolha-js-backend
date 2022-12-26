import { Router } from "express";
import { CreateCategoryController } from "@modules/category/useCases/createCategoryUseCase/CreateCategoryController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const categoryRoutes = Router();

const createCategortController = new CreateCategoryController();

categoryRoutes.post(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    createCategortController.handle
);

export { categoryRoutes };
