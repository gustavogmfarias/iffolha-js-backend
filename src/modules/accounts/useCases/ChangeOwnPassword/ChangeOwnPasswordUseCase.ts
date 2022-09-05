import { IUpdateUserDTO } from "@modules/accounts/dtos/IUpdateUserDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { User } from "@prisma/client";
import { AppError } from "@shared/errors/AppError";
import { compare, hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";

@injectable()
class ChangeOwnPasswordUseCase {
    constructor(
        @inject("UsersRepository") private usersRepository: IUsersRepository
    ) {}

    async execute({
        userAdminId,
        newPassword,
        previousPassword,
        confirmNewPassword,
    }: IUpdateUserDTO): Promise<User> {
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
            throw new AppError("Passwords don't match", 401);
        }

        await this.usersRepository.update({
            userToEditId: userAdminId,
            userAdminId,
            newPassword: passwordHash,
        });

        return user;
    }
}

export { ChangeOwnPasswordUseCase };
