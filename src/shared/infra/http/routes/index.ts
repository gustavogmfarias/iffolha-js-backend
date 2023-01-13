import { Router } from "express";
import { articlesRoutes } from "./articles.routes";
import { authenticateRoutes } from "./authenticate.routes";
import { categoryRoutes } from "./category.routes";
import { logsRoutes } from "./logs.routes";
import { tagsRoutes } from "./tags.routes";
import { usersRoutes } from "./users.routes";
import { textualGenreRoutes } from "./texualGenre.routes";

const router = Router();
router.use("/users", usersRoutes);
router.use("/logs", logsRoutes);
router.use("/tags", tagsRoutes);
router.use("/categories", categoryRoutes);
router.use("/articles", articlesRoutes);
router.use("/textualgenre", textualGenreRoutes);
router.use(authenticateRoutes);

export { router };
