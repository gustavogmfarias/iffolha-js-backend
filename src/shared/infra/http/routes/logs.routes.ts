import { Router } from "express";
import { ListLogsController } from "@modules/logs/useCases/ListLogs/ListLogsController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";

const logsRoutes = Router();

const listLogsController = new ListLogsController();

logsRoutes.get(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    listLogsController.handle
);

export { logsRoutes };
