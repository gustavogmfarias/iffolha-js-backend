import { User } from "@prisma/client";
import { ILogProvider } from "@shared/container/providers/LogProvider/ILogProvider";
import { AppError } from "@shared/errors/AppError";
import { hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
class CreateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("LogProvider")
        private logProvider: ILogProvider
    ) {}

    async execute(
        userAdminId: string,
        { name, lastName, password, email, avatarUrl, role }: ICreateUserDTO
    ): Promise<User> {
        const userAlreadyExists = await this.usersRepository.findByEmail(email);
        let user;
        if (userAlreadyExists) {
            throw new AppError("User already exists", 400);
        }

        const passwordHash = await hash(password, 12);

        try {
            user = await this.usersRepository.create({
                name,
                lastName,
                password: passwordHash,
                email,
                avatarUrl,
                role,
            });
        } catch {
            throw new AppError("User has not created", 400);
        }

        const log = await this.logProvider.create({
            logRepository: "USER",
            description: `Create a user`,
            previousContent: JSON.stringify(user),
            contentEdited: JSON.stringify(user),
            editedByUserId: userAdminId,
            modelEditedId: user.id,
        });

        return user;
    }
}

export { CreateUserUseCase };
