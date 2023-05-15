import { Router } from "express";

import { UpdateSettingController } from "@modules/setting/useCase/updateSettingUseCase/UpdateSettingController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const settingRoutes = Router();

const updateSettingController = new UpdateSettingController();

settingRoutes.put(
    "/:id",
    ensureAuthenticated,
    ensureAdmin,
    updateSettingController.handle
);

export { settingRoutes };
