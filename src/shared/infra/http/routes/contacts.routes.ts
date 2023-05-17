import { Router } from "express";
import { CreateContactController } from "@modules/contact/useCase/createContactUseCase/CreateContactController";
import { ListContactController } from "@modules/contact/useCase/listContact/ListContactController";
import { DeleteContactController } from "@modules/contact/useCase/deleteContactUseCase/DeleteContactController";
import { UpdateContactController } from "@modules/contact/useCase/updateContactUseCase/UpdateContactController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const contactRoutes = Router();

const createContactController = new CreateContactController();
const listContactController = new ListContactController();
const deleteContactController = new DeleteContactController();
const updateContactController = new UpdateContactController();

contactRoutes.post(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    createContactController.handle
);

contactRoutes.get(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    listContactController.handle
);

contactRoutes.delete(
    "/:id",
    ensureAuthenticated,
    ensureAdmin,
    deleteContactController.handle
);

contactRoutes.put(
    "/:id",
    ensureAuthenticated,
    ensureAdmin,
    updateContactController.handle
);

export { contactRoutes };
