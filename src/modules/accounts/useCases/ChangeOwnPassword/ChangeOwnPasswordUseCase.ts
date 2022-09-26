import { IUpdateUserDTO } from "@modules/accounts/dtos/IUpdateUserDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { Log, User } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { compare, hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";

@injectable()
class ChangeOwnPasswordUseCase {
    constructor(
        @inject("UsersRepository") private usersRepository: IUsersRepository,
        @inject("LogProvider")
        private logProvider: ILogProvider
    ) {}

    async execute({
        userAdminId,
        newPassword,
        previousPassword,
        confirmNewPassword,
    }: IUpdateUserDTO): Promise<(User | Log)[]> {
        const user = await this.usersRepository.findById(userAdminId);
        let passwordHash;

        if (previousPassword) {
            const passwordMatch = await compare(
                previousPassword,
                user.password
            );

            if (!passwordMatch) {
                throw new AppError("Last Password doesn't match", 401);
            }
        }

        if (newPassword === confirmNewPassword) {
            passwordHash = await hash(newPassword, 12);
        } else {
            throw new AppError("Passwords do not match!", 401);
        }

        let userUpdated: User;
        let log: Log;

        try {
            userUpdated = await this.usersRepository.update({
                userToEditId: userAdminId,
                userAdminId,
                newPassword: passwordHash,
            });
        } catch (error) {
            return error.message;
        }

        try {
            log = await this.logProvider.create({
                logRepository: "USER",
                description: `User's password updated successfully!`,
                previousContent: JSON.stringify(user),
                contentEdited: JSON.stringify(userUpdated),
                editedByUserId: userAdminId,
                modelEditedId: user.id,
            });
        } catch (error) {
            return error.message;
        }

        return [userUpdated, log];
    }
}

export { ChangeOwnPasswordUseCase };
