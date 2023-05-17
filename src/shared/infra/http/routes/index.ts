import { Router } from "express";
import { articlesRoutes } from "./articles.routes";
import { authenticateRoutes } from "./authenticate.routes";
import { categoryRoutes } from "./category.routes";
import { logsRoutes } from "./logs.routes";
import { tagsRoutes } from "./tags.routes";
import { usersRoutes } from "./users.routes";
import { textualGenreRoutes } from "./texualGenre.routes";
import { coursesRoutes } from "./courses.routes";
import { classesRoutes } from "./classes.routes";
import { schoollevelRoutes } from "./schoolLevel.routes";
import { socialMediaRoutes } from "./socialMedia.routes";
import { menuAlertRoutes } from "./menuAlert.routes";
import { settingRoutes } from "./setting.routes";
import { contactRoutes } from "./contacts.routes";
import { newsletterRoutes } from "./newsletter.routes";
import { videoRoutes } from "./videos.routes";

const router = Router();
router.use("/users", usersRoutes);
router.use("/logs", logsRoutes);
router.use("/tags", tagsRoutes);
router.use("/categories", categoryRoutes);
router.use("/articles", articlesRoutes);
router.use("/textualgenre", textualGenreRoutes);
router.use("/courses", coursesRoutes);
router.use("/classes", classesRoutes);
router.use("/schoollevel", schoollevelRoutes);
router.use("/socialmedia", socialMediaRoutes);
router.use("/menualert", menuAlertRoutes);
router.use("/setting", settingRoutes);
router.use("/contacts", contactRoutes);
router.use("/newsletter", newsletterRoutes);
router.use("/videos", videoRoutes);
router.use(authenticateRoutes);

export { router };
