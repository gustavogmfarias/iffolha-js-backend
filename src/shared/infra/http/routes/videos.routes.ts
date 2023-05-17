import { Router } from "express";
import { CreateVideoController } from "@modules/video/useCase/createVideoUseCase/CreateVideoController";
import { ListVideoController } from "@modules/video/useCase/listVideo/ListVideoController";
import { DeleteVideoController } from "@modules/video/useCase/deleteVideoUseCase/DeleteVideoController";
import { UpdateVideoController } from "@modules/video/useCase/updateVideoUseCase/UpdateVideoController";
import multer from "multer";
import uploadConfig from "@config/upload";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const uploadVideoImage = multer(uploadConfig);

const videoRoutes = Router();

const createVideoController = new CreateVideoController();
const listVideoController = new ListVideoController();
const deleteVideoController = new DeleteVideoController();
const updateVideoController = new UpdateVideoController();

videoRoutes.post(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    createVideoController.handle
);

videoRoutes.get(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    listVideoController.handle
);

videoRoutes.delete(
    "/:id",
    ensureAuthenticated,
    ensureAdmin,
    deleteVideoController.handle
);

videoRoutes.put(
    "/:id",
    ensureAuthenticated,
    ensureAdmin,
    updateVideoController.handle
);

videoRoutes.patch(
    "/image/:id",
    ensureAuthenticated,
    uploadVideoImage.single("imageFile"),
    updateVideoController.handle
);

export { videoRoutes };
