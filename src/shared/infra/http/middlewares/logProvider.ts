import { NextFunction, Request, Response } from "express";
import { AppError } from "@shared/errors/AppError";
import { Log } from "@prisma/client";
import { prisma } from "@shared/database/prismaClient";

export async function logProvider(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const {
        logRepository,
        description,
        previousContent,
        contentEdited,
        editedByUserId,
        modelEditedId,
    } = request.log;
    try {
        const logCreated = await prisma.log.create({
            data: {
                logRepository,
                description,
                previousContent,
                contentEdited,
                editedByUserId,
                modelEditedId,
            },
        });

        next();
    } catch {
        throw new AppError("Log hasn't created", 400);
    }
}
