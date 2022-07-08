import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { User } from "@prisma/client";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class DeleteUserUseCase {
    constructor(
        @inject("UsersRepository") private usersRepository: IUsersRepository
    ) {}

    async execute(id: string): Promise<void> {
        let user;
        if (typeof id === "string") {
            user = this.usersRepository.findById(id);
        } else {
            throw new AppError("Format not allowed", 406);
        }

        if (!user) {
            throw new AppError("User doesn't exists", 404);
        }

        this.usersRepository.delete(id);
    }
}

export { DeleteUserUseCase };
