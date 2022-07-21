import "reflect-metadata";
import "dotenv/config";
import "@shared/container";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import upload from "@config/upload";

import swaggerFile from "./swagger.json";
import { AppError } from "../../errors/AppError";
import { router } from "./routes";

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(express.json());

app.use(cors());

app.use(router);

app.use("/avatar", express.static(`${upload.tmpFolder}/avatar`));

app.use(
    (err: Error, request: Request, response: Response, next: NextFunction) => {
        if (err instanceof AppError) {
            return response
                .status(err.statusCode)
                .json({ message: err.message });
        }

        return response.status(500).json({
            status: "error",
            message: `Internal Server Error - ${err.message}`,
        });
    }
);

export { app };
