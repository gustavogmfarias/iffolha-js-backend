import { IUserResponseDTO } from "@modules/accounts/dtos/IUserResponseDTO";
import { UserMap } from "@modules/accounts/mapper/UserMap";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { Log, User } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class DeleteUserUseCase {
    constructor(
        @inject("UsersRepository") private usersRepository: IUsersRepository,
        @inject("LogProvider")
        private logProvider: ILogProvider
    ) {}

    async execute(
        userAdminId: string,
        userToEditId: string
    ): Promise<(IUserResponseDTO | Log)[]> {
        const user = await this.usersRepository.findById(userToEditId);

        if (!user) {
            throw new AppError("User doesn't exists", 404);
        }
        const userDto = await this.usersRepository.convertDTO(user);
        let userDeleted;

        try {
            userDeleted = this.usersRepository.delete(userToEditId);
        } catch (err) {
            throw new AppError("User wasn't deleted", 401);
        }

        const log = await this.logProvider.create({
            logRepository: "USER",
            description: `User successfully deleted!`,
            previousContent: JSON.stringify(userDto),
            contentEdited: JSON.stringify(userDto),
            editedByUserId: userAdminId,
            modelEditedId: user.id,
        });

        return [user, log];
    }
}

export { DeleteUserUseCase };
