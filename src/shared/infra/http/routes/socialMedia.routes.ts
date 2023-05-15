import { Router } from "express";
import { CreateSocialMediaController } from "@modules/socialMedia/useCase/createSocialMediaUseCase/CreateSocialMediaController";
import { ListSocialMediaController } from "@modules/socialMedia/useCase/listSocialMedia/ListSocialMediaController";
import { DeleteSocialMediaController } from "@modules/socialMedia/useCase/deleteSocialMediaUseCase/DeleteSocialMediaController";
import { UpdateSocialMediaController } from "@modules/socialMedia/useCase/updateSocialMediaUseCase/UpdateSocialMediaController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const socialMediaRoutes = Router();

const createSocialMediaController = new CreateSocialMediaController();
const listSocialMediaController = new ListSocialMediaController();
const deleteSocialMediaController = new DeleteSocialMediaController();
const updateSocialMediaController = new UpdateSocialMediaController();

socialMediaRoutes.post(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    createSocialMediaController.handle
);

socialMediaRoutes.get(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    listSocialMediaController.handle
);

socialMediaRoutes.delete(
    "/:id",
    ensureAuthenticated,
    ensureAdmin,
    deleteSocialMediaController.handle
);

socialMediaRoutes.put(
    "/:id",
    ensureAuthenticated,
    ensureAdmin,
    updateSocialMediaController.handle
);

export { socialMediaRoutes };
