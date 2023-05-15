import { Router } from "express";
import { CreateMenuAlertController } from "@modules/menuAlert/useCase/createMenuAlertUseCase/CreateMenuAlertController";
import { ListMenuAlertController } from "@modules/menuAlert/useCase/listMenuAlert/ListMenuAlertController";
import { DeleteMenuAlertController } from "@modules/menuAlert/useCase/deleteMenuAlertUseCase/DeleteMenuAlertController";
import { UpdateMenuAlertController } from "@modules/menuAlert/useCase/updateMenuAlertUseCase/UpdateMenuAlertController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const menuAlertRoutes = Router();

const createMenuAlertController = new CreateMenuAlertController();
const listMenuAlertController = new ListMenuAlertController();
const deleteMenuAlertController = new DeleteMenuAlertController();
const updateMenuAlertController = new UpdateMenuAlertController();

menuAlertRoutes.post(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    createMenuAlertController.handle
);

menuAlertRoutes.get(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    listMenuAlertController.handle
);

menuAlertRoutes.delete(
    "/:id",
    ensureAuthenticated,
    ensureAdmin,
    deleteMenuAlertController.handle
);

menuAlertRoutes.put(
    "/:id",
    ensureAuthenticated,
    ensureAdmin,
    updateMenuAlertController.handle
);

export { menuAlertRoutes };
