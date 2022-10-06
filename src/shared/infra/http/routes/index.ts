import { Router } from "express";
import { authenticateRoutes } from "./authenticate.routes";
import { logsRoutes } from "./logs.routes";
import { usersRoutes } from "./users.routes";

const router = Router();
router.use("/users", usersRoutes);
router.use("/logs", logsRoutes);
router.use(authenticateRoutes);

export { router };
