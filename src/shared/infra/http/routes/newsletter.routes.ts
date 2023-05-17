import { Router } from "express";
import { CreateNewsletterController } from "@modules/newsletter/useCase/createNewsletterUseCase/CreateNewsletterController";
import { ListNewsletterController } from "@modules/newsletter/useCase/listNewsletter/ListNewsletterController";
import { DeleteNewsletterController } from "@modules/newsletter/useCase/deleteNewsletterUseCase/DeleteNewsletterController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const newsletterRoutes = Router();

const createNewsletterController = new CreateNewsletterController();
const listNewsletterController = new ListNewsletterController();
const deleteNewsletterController = new DeleteNewsletterController();

newsletterRoutes.post(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    createNewsletterController.handle
);

newsletterRoutes.get(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    listNewsletterController.handle
);

newsletterRoutes.delete(
    "/:id",
    ensureAuthenticated,
    ensureAdmin,
    deleteNewsletterController.handle
);

export { newsletterRoutes };
