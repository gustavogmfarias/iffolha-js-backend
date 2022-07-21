import { NextFunction, Request, Response } from "express";
import { UsersRepository } from "@modules/accounts/repositories/infra/UsersRepository";
import { AppError } from "@shared/errors/AppError";

export async function ensureAdmin(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const { id } = request.user;
    const usersRepository = new UsersRepository();
    const user = await usersRepository.findById(id);

    const log = await this.logProvider.create({
        logRepository: "USER",
        description: `Updated the user`,
        previousContent: JSON.stringify(userToEdit),
        contentEdited: JSON.stringify(userEdited),
        editedByUserId: userAdminId,
        modelEditedId: userToEdit.id,
    });

    return next();
}
