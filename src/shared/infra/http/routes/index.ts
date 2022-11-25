import { Router } from "express";
import { articlesRoutes } from "./articles.routes";
import { authenticateRoutes } from "./authenticate.routes";
import { logsRoutes } from "./logs.routes";
import { usersRoutes } from "./users.routes";

const router = Router();
router.use("/users", usersRoutes);
router.use("/logs", logsRoutes);
router.use("/articles", articlesRoutes);
router.use(authenticateRoutes);

export { router };
