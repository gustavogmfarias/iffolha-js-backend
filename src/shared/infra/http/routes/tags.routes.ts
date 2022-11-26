import { Router } from "express";
import { CreateTagController } from "@modules/tags/useCases/createTagUseCase/CreateTagController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const tagsRoutes = Router();

const createTagController = new CreateTagController();

tagsRoutes.post(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    createTagController.handle
);

export { tagsRoutes };
