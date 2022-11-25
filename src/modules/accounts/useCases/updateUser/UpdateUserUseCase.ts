import { IUpdateUserDTO } from "@modules/accounts/dtos/IUpdateUserDTO";
import { IUserResponseDTO } from "@modules/accounts/dtos/IUserResponseDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { Log, User } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { compare, hash } from "bcryptjs";
import { injectable, inject } from "tsyringe";

@injectable()
class UpdateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("LogProvider") private logProvider: ILogProvider
    ) {}

    async execute({
        userAdminId,
        userToEditId,
        name,
        lastName,
        email,
        role,
        newPassword,
        previousPassword,
        confirmNewPassword,
    }: IUpdateUserDTO): Promise<(IUserResponseDTO | Log)[]> {
        const userToEdit = await this.usersRepository.findById(userToEditId);

        if (!userToEdit) {
            throw new AppError("User doesn't exists", 404);
        }

        let passwordHash;

        if (previousPassword) {
            const passwordMatch = await compare(
                previousPassword,
                userToEdit.password
            );

            if (!passwordMatch) {
                throw new AppError("Previous password is not correct", 401);
            }
        }
        if (newPassword && confirmNewPassword) {
            if (newPassword === confirmNewPassword) {
                passwordHash = await hash(newPassword, 12);
            } else {
                throw new AppError("Passwords do not match!", 401);
            }
        }

        const userEdited = await this.usersRepository.update({
            userToEditId,
            name,
            lastName,
            newPassword: passwordHash,
            email,
            role,
        });

        const userEditedDTO = this.usersRepository.convertDTO(userEdited);

        const log = await this.logProvider.create({
            logRepository: "USER",
            description: `User successfully updated!`,
            previousContent: JSON.stringify(userToEdit),
            contentEdited: JSON.stringify(userEdited),
            editedByUserId: userAdminId,
            modelEditedId: userToEdit.id,
        });

        return [userEditedDTO, log];
    }
}

export { UpdateUserUseCase };
